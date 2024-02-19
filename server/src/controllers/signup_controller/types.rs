use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow, Validate)]
pub struct UserInfo {
  #[validate(length(
    min = 1,
    message = "ApiError: 新規登録で名前が正常にリクエストされませんでした"
  ))]
  pub name: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 新規登録でメールアドレスが正常にリクエストされませんでした"
  ))]
  pub email: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 新規登録でパスワードが正常にリクエストされませんでした"
  ))]
  pub password: String,
  #[validate(length(
    min = 1,
    message = "ApiError: 新規登録で性別が正常にリクエストされませんでした"
  ))]
  pub gender: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow)]
pub struct UserInfoResult {
  pub name: String,
  pub email: String,
  pub password: String,
  pub gender: String,
  pub user_id: String,
}
