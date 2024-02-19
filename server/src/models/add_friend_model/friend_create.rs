use sqlx::{Pool, Postgres};

use crate::controllers::add_friend_controller::types::FriendLinking;

pub async fn friend_create(
  pool: &Pool<Postgres>,
  friend_linking: &FriendLinking,
) -> anyhow::Result<FriendLinking> {
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, FriendLinking>(
    r#"
      INSERT INTO friendship (friendship_user_id, friendship_friend_id) VALUES (
      CASE WHEN (SELECT count(friendship_user_id) FROM friendship WHERE friendship_user_id = $1 AND friendship_friend_id = $2) = 0 THEN $1 ELSE NULL END, 
      $2)
      returning *
      "#,
  )
  .bind(friend_linking.friendship_user_id.clone())
  .bind(friend_linking.friendship_friend_id.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "友達登録完了 user_name: {:?}, friend_name: {:?}",
    friend_linking.friendship_user_id.clone(),
    friend_linking.friendship_friend_id.clone(),
  );

  Ok(result)
}
