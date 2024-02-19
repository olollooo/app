use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension, Json};
use sqlx::PgPool;
use std::sync::Arc;

use crate::controllers::add_answer_controller::types::Answer;
use crate::middleware::validation::ValidatedJson;
use crate::models::add_answer_model::answer_create::answer_create;

pub async fn answer_create_controller(
  Extension(pool): Extension<Arc<PgPool>>,
  ValidatedJson(payload): ValidatedJson<Answer>,
) -> Result<impl IntoResponse, impl IntoResponse> {
  let question_id = Some(payload.question_id);
  let question_id: i32 = match question_id {
    Some(question_id) => question_id,
    None => {
      tracing::error!(
        "Error function: answer_create_controller, Error message: question_id is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 称賛内容を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  let name_display = Some(payload.name_display);
  let name_display: bool = match name_display {
    Some(name_display) => name_display,
    None => {
      tracing::error!(
        "Error function: answer_create_controller, Error message: name_display is empty"
      );
      return Err((
        StatusCode::BAD_REQUEST,
        Json("Validation error: 名前の表示を取得出来ませんでした。お問い合わせ下さい。"),
      ));
    }
  };

  let answer = Answer {
    answer_user_id: payload.answer_user_id,
    answer_friend_id: payload.answer_friend_id,
    question_id,
    name_display,
    registration_time: payload.registration_time
  };

  match answer_create(&pool, &answer).await {
    Ok(res) => Ok((StatusCode::CREATED, Json(res))),
    Err(e) => {
      tracing::error!(
        "answer_user_id: {:?}, answer_friend_id: {:?}, question_id: {:?}, name_display: {:?}, registration_time: {:?}, Error function: answer_create(), Error message: {:?}",
        answer.answer_user_id.clone(),
        answer.answer_friend_id.clone(),
        answer.question_id.clone(),
        answer.name_display.clone(),
        answer.registration_time.clone(),
        e
      );

      Err((StatusCode::BAD_REQUEST, Json("Api error: 称賛登録でエラーが発生しました。お問い合わせ下さい。")))
    }
  }
}