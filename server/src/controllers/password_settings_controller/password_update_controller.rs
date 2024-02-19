use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::password_settings_controller::types::PasswordSettings;
use crate::middleware::validation::ValidatedJson;
use crate::models::password_settings_model::password_update::password_update;

pub async fn password_update_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<PasswordSettings>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let password_chg = PasswordSettings {
    password: payload.password,
    email: payload.email,
  };

  match password_update(&pool, &password_chg).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "new_password: {:?}, email: {:?}, Error function: password_info_update(), Error message: {:?}",
        password_chg.password.clone(),
        password_chg.email.clone(),
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: パスワード更新でエラーが発生しました。お問い合わせ下さい。"),
      ))
    }
  }
}
