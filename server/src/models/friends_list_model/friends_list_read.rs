use sqlx::{Pool, Postgres};

use crate::controllers::friends_list_controller::types::FriendsList;

pub async fn friends_list_read(
  pool: &Pool<Postgres>,
  firebase_id: String,
) -> anyhow::Result<Vec<FriendsList>> {

  let result = sqlx::query_as::<_, FriendsList>(
    r#"
    SELECT user_information.name, friendship.friendship_friend_id FROM friendship 
    INNER JOIN user_information ON friendship.friendship_friend_id = user_information.user_id
    WHERE friendship.friendship_user_id = (SELECT user_id FROM user_information WHERE firebase_id = $1)
    "#,
  )
  .bind(firebase_id.clone())
  .fetch_all(pool)
  .await?;

Ok(result)
}