use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::firebase_controller::types::FirebaseID;
use crate::middleware::validation::ValidatedJson;
use crate::models::firebase_model::firebase_create::firebase_create;

pub async fn firebase_create_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<FirebaseID>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let firebase = FirebaseID {
    firebase_id: payload.firebase_id,
    email: payload.email,
    password: payload.password,
  };

  match firebase_create(&pool, &firebase).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "firebase_id: {:?}, Error function: firebae_create(), Error message: {:?}",
        firebase.clone(),
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: firebase情報登録でエラーが発生しました。お問い合わせ下さい。"),
      ))
    }
  }
}
