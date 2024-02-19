use axum::extract::Query;
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;

use crate::models::delete_friend_model::friend_delete::friend_delete;

pub async fn friend_delete_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  Query(params): Query<HashMap<String, String>>
) -> Result<impl IntoResponse, impl IntoResponse> {
  let user_id: String = match params.get("friendshipuserid") {
    Some(user_id) => user_id.to_string(),
    None => {
      tracing::error!(
        "Error function: friend_delete_controller, Error message: friendship_user_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 削除する値を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  let friend_id: String = match params.get("friendshipfriendid") {
    Some(friend_id) => friend_id.to_string(),
    None => {
      tracing::error!(
        "Error function: friend_delete_controller, Error message: friendship_user_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 削除する値を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  match friend_delete(&pool, user_id.clone(), friend_id.clone()).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "friendship_user_id: {:?}, friendship_friend_id: {:?}, Error function: friend_delete(), Error message: {:?}",
        &user_id,
        &friend_id,
        e
      );

      Err((StatusCode::BAD_REQUEST, Json("Api error: フレンド情報の削除に失敗しました。お問い合わせ下さい。")))
    }
  }
}