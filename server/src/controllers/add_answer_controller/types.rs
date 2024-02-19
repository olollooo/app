use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct Answer {
  #[validate(length(
    min = 1,
    message = "ApiError: 称賛登録でユーザが正常にリクエストされませんでした"
  ))]
  pub answer_user_id: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 称賛登録でフレンドが正常にリクエストされませんでした"
  ))]
  pub answer_friend_id: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 称賛登録で時刻が正常にリクエストされませんでした"
  ))]
  pub registration_time: String,
  pub question_id: i32,
  pub name_display: bool,
}
