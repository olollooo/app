use sqlx::{Pool, Postgres};

use crate::controllers::password_settings_controller::types::PasswordSettings;

pub async fn password_update(
  pool: &Pool<Postgres>,
  password_chg: &PasswordSettings,
) -> anyhow::Result<PasswordSettings> {
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, PasswordSettings>(
    r#"
      UPDATE user_information SET password = $1 WHERE email = $2
      returning *
      "#,
  )
  .bind(password_chg.password.clone())
  .bind(password_chg.email.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "パスワード更新完了 new_password: {:?}, email: {:?}",
    password_chg.password.clone(),
    password_chg.email.clone(),
  );

  Ok(result)
}
