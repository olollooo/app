use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::get_user_information_model::user_name_and_id_read::user_name_and_id_read;

pub async fn name_and_id_read_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let firebase_id: String = match params.get("firebaseid") {
    Some(firebase_id) => firebase_id.to_string(),
    None => {
      tracing::error!(
        "Error function: name_and_id_read_controller, Error message: user_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: ユーザ情報の入力を取得出来ませんでした。 お問い合わせ下さい。"),
      ));
    }
  };

  match user_name_and_id_read(&pool, firebase_id.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "user_id: {:?}, error_function: user_name_and_id_read(), error_message: {:?}",
        &firebase_id,
        e
      );

      Err((
        StatusCode::BAD_REQUEST,
        Json("Api error: ユーザ情報の取得に失敗しました。お問い合わせ下さい。"),
      ))
    }
  }
}
