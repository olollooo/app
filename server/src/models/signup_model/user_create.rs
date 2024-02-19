use harsh::Harsh;
use sqlx::{Pool, Postgres};

use crate::controllers::signup_controller::types::{UserInfo, UserInfoResult};

pub async fn user_create(
  pool: &Pool<Postgres>,
  user_info: &UserInfo,
) -> anyhow::Result<UserInfoResult> {
  let mut transaction = pool.begin().await?;

  let harsh = Harsh::builder()
    .salt(user_info.name.clone())
    .build()
    .unwrap();
  let user_id = harsh.encode(&[1, 2, 3]);

  let result = sqlx::query_as::<_, UserInfoResult>(
    r#"
      INSERT INTO user_information (name, email, password, gender, user_id) VALUES ($1, $2, $3, $4, $5)
      returning *
      "#,
  )
  .bind(user_info.name.clone())
  .bind(user_info.email.clone())
  .bind(user_info.password.clone())
  .bind(user_info.gender.clone())
  .bind(user_id.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "登録完了 name: {:?}, email: {:?}, password: {:?}, gender: {:?}, uuid {:?}",
    user_info.name.clone(),
    user_info.email.clone(),
    user_info.password.clone(),
    user_info.gender.clone(),
    user_id
  );

  Ok(result)
}

#[cfg(test)]
mod tests {
    use sqlx::postgres::PgPoolOptions;
    use std::time::Duration;
    use super::*;

    #[tokio::test]
    async fn test_user_create_ok() -> anyhow::Result<()> {

      dotenv::dotenv().ok();

      let db_url = fetch_database_url();
      let pool = PgPoolOptions::new()
          .max_connections(5)
          .idle_timeout(Duration::from_secs(1))
          .connect(&db_url)
          .await?;

        let user = UserInfo {
          name: "テスト".to_string(),
          email: "test@test.com".to_string(),
          password: "testpw".to_string(),
          gender: "man".to_string(),
        };

        let test_result = user_create(&pool, &user).await;

        let test_result_ok: UserInfoResult = match test_result {
          Ok(test_result_ok) => test_result_ok,
          Err(e) => panic!("user_create.rs, function: user_create, errorMessage: {}", e)
        };

        let user_result = UserInfoResult {
          name: "テスト".to_string(),
          email: "test@test.com".to_string(),
          password: "testpw".to_string(),
          gender: "man".to_string(),
          user_id: test_result_ok.user_id.to_string(),
        };
        assert_eq!(test_result_ok, user_result);
        
        Ok(())
    }

    fn fetch_database_url() -> String {
      use std::env::VarError;

      match std::env::var("DATABASE_TEST_URL") {
          Ok(s) => s,
          Err(VarError::NotPresent) => panic!("Environment variable DATABASE_TEST_URL is required."),
          Err(VarError::NotUnicode(_)) => {
              panic!("Environment variable DATABASE_TEST_URL is not unicode.")
          }
      }
  }
}