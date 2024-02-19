use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct FirebaseID {
  #[validate(length(
    min = 1,
    message = "ApiError: firebase情報登録でidが正常にリクエストされませんでした"
  ))]
  pub firebase_id: String,
  #[validate(length(
    min = 1,
    message = "ApiError: firebase情報登録でメールアドレスが正常にリクエストされませんでした"
  ))]
  pub email: String,
  #[validate(length(
    min = 1,
    message = "ApiError: firebase情報登録でパスワードが正常にリクエストされませんでした"
  ))]
  pub password: String,
}
