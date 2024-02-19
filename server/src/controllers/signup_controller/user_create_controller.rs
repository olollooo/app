use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::signup_controller::types::UserInfo;
use crate::middleware::validation::ValidatedJson;
use crate::models::signup_model::user_create::user_create;

pub async fn user_create_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<UserInfo>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let user_info = UserInfo {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    gender: payload.gender,
  };

  match user_create(&pool, &user_info).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "name: {:?}, email: {:?}, Error function: user_create(), Error message: {:?}",
        user_info.name.clone(),
        user_info.email.clone(),
        e
      );

      Err((StatusCode::BAD_REQUEST, Json(error_message(e.to_string()))))
    }
  }
}

fn error_message(error: String) -> &'static str {
  if error.contains("name") {
    return "Api error: 既に名前が登録されています。他の名前で登録して下さい。";
  } else if error.contains("email") {
    return "Api error: 既にメールアドレスが登録されています";
  } else {
    return "Api error: ユーザ情報登録でエラーが発生しました。お問い合わせ下さい。";
  };
}
