use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct EmailSettings {
  #[validate(length(
    min = 1,
    message = "ApiError: メールアドレス更新でパスワードが正常にリクエストされませんでした"
  ))]
  pub password: String,
  #[validate(length(
    min = 1,
    message = "ApiError: メールアドレス更新でメールアドレスが正常にリクエストされませんでした"
  ))]
  pub email: String,
  #[validate(length(
    min = 1,
    message = "ApiError: メールアドレス更新で既存のメールアドレスが正常にリクエストされませんでした"
  ))]
  pub old_email: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow)]
pub struct EmailSettingsResult {
  pub email: String,
  pub password: String,
}
