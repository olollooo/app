use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::find_friend_model::friend_name_read::friend_name_read;

pub async fn friend_name_read_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let friend_id: String = match params.get("friendid") {
    Some(friend_id) => friend_id.to_string(),
    None => {
      tracing::error!(
        "Error function: friend_name_read_controller, Error message: friend_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: フレンド情報の入力を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  let firebase_id: String = match params.get("firebaseid") {
    Some(firebase_id) => firebase_id.to_string(),
    None => {
      tracing::error!(
        "Error function: friend_name_read_controller, Error message: firebase_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: フレンド情報の入力を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  match friend_name_read(&pool, friend_id.clone(), firebase_id.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "friend_id: {:?}, error_function: friend_name_read_controller(), error_message: {:?}",
        &friend_id,
        e
      );
      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: フレンド情報の取得に失敗しました。お問い合わせ下さい。"),
      ))
    }
  }
}
