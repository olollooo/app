use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::get_answer_model::answer_read::answer_read;

pub async fn answer_read_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let firebase_id: String = match params.get("firebaseid") {
    Some(firebase_id) => firebase_id.to_string(),
    None => {
      tracing::error!(
        "Error function: answer_read_controller, Error message: firebase_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 称賛内容取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  match answer_read(&pool, firebase_id.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "firebase_id: {:?}, error_function: answer_read(), error_message: {:?}",
        &firebase_id,
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: 称賛内容取得出来ませんでした。お問い合わせ下さい。"),
      ))
    }
  }
}
