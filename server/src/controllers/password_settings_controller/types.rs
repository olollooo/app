use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct PasswordSettings {
  #[validate(length(
    min = 1,
    message = "ApiError: パスワード変更で新規パスワードが正常にリクエストされませんでした"
  ))]
  pub password: String,
  #[validate(length(
    min = 1,
    message = "ApiError: パスワード変更でメールアドレスが正常にリクエストされませんでした"
  ))]
  pub email: String,
}
