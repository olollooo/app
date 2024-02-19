use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::models::question_content_model::question_content_read::question_content_read;

pub async fn question_count_read_controller (
  Extension(pool): Extension<Arc<PgPool>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  match question_content_read(&pool).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "error_function: question_content_read(), error_message: {:?}",
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: 質問内容の取得に失敗しました。お問い合わせ下さい。"),
      ))
    }
  }
}
