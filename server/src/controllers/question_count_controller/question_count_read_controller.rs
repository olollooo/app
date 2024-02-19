use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::question_count_model::question_count_read::question_count_read;

pub async fn question_count_read_controller (
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let firebase_id: String = match params.get("firebaseid") {
    Some(firebase_id) => firebase_id.to_string(),
    None => {
      tracing::error!(
        "Error function: question_count_read_controller, Error message: firebase_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 質問回数を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  let registration_time: String = match params.get("registrationtime") {
    Some(registration_time) => registration_time.to_string(),
    None => {
      tracing::error!(
        "Error function: question_count_read_controller, Error message: registration_time is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 質問回数を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  match question_count_read(&pool, firebase_id.clone(), registration_time.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "firebase_id: {:?}, registration_time: {:?}, error_function: question_count_read(), error_message: {:?}",
        &firebase_id,
        &registration_time,
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: 質問回数の取得に失敗しました。お問い合わせ下さい。"),
      ))
    }
  }
}
