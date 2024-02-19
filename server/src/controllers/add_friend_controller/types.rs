use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct FriendLinking {
  #[validate(length(
    min = 1,
    message = "ApiError: 友達登録でユーザが正常にリクエストされませんでした"
  ))]
  pub friendship_user_id: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 友達登録でフレンドが正常にリクエストされませんでした"
  ))]
  pub friendship_friend_id: String,
}
