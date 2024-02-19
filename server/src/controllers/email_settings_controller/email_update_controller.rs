use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::email_settings_controller::types::EmailSettings;

use crate::middleware::validation::ValidatedJson;
use crate::models::email_settings_model::email_update::email_update;

pub async fn email_update_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<EmailSettings>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let email_chg = EmailSettings {
    password: payload.password,
    email: payload.email,
    old_email: payload.old_email,
  };

  match email_update(&pool, &email_chg).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "new_email: {:?}, old_email: {:?}, Error function: email_info_update(), Error message: {:?}",
        email_chg.email.clone(),
        email_chg.old_email.clone(),
        e
      );
      Err((StatusCode::BAD_REQUEST, Json(error_message(e.to_string()))))
    }
  }
}

fn error_message(error: String) -> &'static str {
  if error.contains("email") {
    return "Api error: 既にメールアドレスが登録されています";
  } else {
    return "Api error: メールアドレス更新でエラーが発生しました。お問い合わせ下さい。";
  };
}
