use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::add_friend_controller::types::FriendLinking;
use crate::middleware::validation::ValidatedJson;
use crate::models::add_friend_model::friend_create::friend_create;

pub async fn friend_create_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<FriendLinking>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let friend_linking = FriendLinking {
    friendship_user_id: payload.friendship_user_id,
    friendship_friend_id: payload.friendship_friend_id,
  };

  match friend_create(&pool, &friend_linking).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "user_name: {:?}, friend_name: {:?}, Error function: friend_create(), Error message: {:?}",
        friend_linking.friendship_user_id.clone(),
        friend_linking.friendship_friend_id.clone(),
        e
      );

      Err((StatusCode::BAD_REQUEST, Json(error_message(e.to_string()))))
    }
  }
}

fn error_message(error: String) -> &'static str {
  if error.contains("not-null constraint") {
    return "Api error: 既に友達が登録されています。";
  } else {
    return "Api error: 友達登録でエラーが発生しました。お問い合わせ下さい。";
  };
}
