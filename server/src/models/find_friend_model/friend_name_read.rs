use sqlx::{Pool, Postgres};

use crate::controllers::find_friend_controller::types::FriendName;

pub async fn friend_name_read(
  pool: &Pool<Postgres>,
  friend_id: String,
  firebase_id: String,
) -> anyhow::Result<FriendName> {
  let result = sqlx::query_as::<_, FriendName>(
    r#"
      SELECT name FROM user_information WHERE user_id = $1 AND not firebase_id = $2
      "#,
  )
  .bind(friend_id.clone())
  .bind(firebase_id.clone())
  .fetch_optional(pool)
  .await?;

  if let Some(sql_result) = result {
    Ok(sql_result)
  } else {
    let sql_result = FriendName { name: None };
    Ok(sql_result)
  }
}
