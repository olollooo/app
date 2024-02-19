use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct FriendDelete {
  #[validate(length(
    min = 1,
    message = "ApiError: 友達削除でユーザが正常にリクエストされませんでした"
  ))]
  pub friendship_user_id: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 友達削除でフレンドが正常にリクエストされませんでした"
  ))]
  pub friendship_friend_id: String,
}
