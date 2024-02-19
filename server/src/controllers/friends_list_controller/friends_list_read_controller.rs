use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::friends_list_model::friends_list_read::friends_list_read;

pub async fn friends_list_read_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let firebase_id: String = match params.get("firebaseid") {
    Some(firebase_id) => firebase_id.to_string(),
    None => {
      tracing::error!(
        "Error function: friends_list_read_controller, Error message: firebase_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: フレンド一覧を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  match friends_list_read(&pool, firebase_id.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "firebase_id: {:?}, error_function: friends_list_read_controller(), error_message: {:?}",
        &firebase_id,
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: フレンド一覧取得に失敗しました。お問い合わせ下さい。"),
      ))
    }
  }
}
