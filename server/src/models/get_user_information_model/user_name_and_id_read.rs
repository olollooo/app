use sqlx::{Pool, Postgres};

use crate::controllers::get_user_information_controller::types::NameAndUserID;

pub async fn user_name_and_id_read(
  pool: &Pool<Postgres>,
  firebase_id: String,
) -> anyhow::Result<NameAndUserID> {
  let result = sqlx::query_as::<_, NameAndUserID>(
    r#"
      SELECT name, user_id FROM user_information WHERE firebase_id = $1
      "#,
  )
  .bind(firebase_id.clone())
  .fetch_one(pool)
  .await?;

  tracing::info!(
    "名前とユーザID取得 firebase_id: {:?}, name: {:?}, user_id: {:?}",
    firebase_id.clone(),
    result.name,
    result.user_id,
  );

  Ok(result)
}
