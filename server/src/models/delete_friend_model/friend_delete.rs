use sqlx::{Pool, Postgres};

use crate::controllers::delete_friend_controller::types::FriendDelete;

pub async fn friend_delete(
  pool: &Pool<Postgres>,
  user_id: String,
  friend_id: String,
) -> anyhow::Result<FriendDelete> {
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, FriendDelete>(
    r#"
      DELETE FROM friendship WHERE (friendship_user_id = $1 AND friendship_friend_id = $2) OR (friendship_user_id = $2 AND friendship_friend_id = $1)
      returning *
      "#,
  )
  .bind(user_id.clone())
  .bind(friend_id.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "友達削除完了 friendship_user_id: {:?}, friendship_friend_id: {:?}",
    user_id.clone(),
    friend_id.clone(),
  );

  Ok(result)
}
