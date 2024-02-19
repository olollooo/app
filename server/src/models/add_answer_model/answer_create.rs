use sqlx::{postgres::PgRow, Pool, Postgres, Row};

use crate::controllers::add_answer_controller::types::Answer;

pub async fn answer_create(
  pool: &Pool<Postgres>,
  answer: &Answer,
) -> anyhow::Result<Answer> {
  // let mut transaction = pool.begin().await?;

  // sqlx::query("DELETE FROM answer WHERE answer_user_id = (SELECT user_id FROM user_information WHERE firebase_id = $1) AND answer_friend_id = $2")
  // .bind(answer.answer_user_id.clone())
  // .bind(answer.answer_friend_id.clone())
  // .execute(&mut transaction)
  // .await?;

  // transaction.commit().await?;

  if reciprocal_followings_check(&answer.answer_user_id, &answer.answer_friend_id, pool).await? == 0 {
    return Ok(answer.clone())
  }
  
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, Answer>(
    r#"
      INSERT INTO answer (answer_user_id, answer_friend_id, question_id, name_display, registration_time) VALUES 
      ((SELECT user_id FROM user_information WHERE firebase_id = $1), $2, $3, $4, $5)
      returning *
      "#,
  )
  .bind(answer.answer_user_id.clone())
  .bind(answer.answer_friend_id.clone())
  .bind(answer.question_id)
  .bind(answer.name_display)
  .bind(answer.registration_time.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;
  tracing::info!(
    "称賛登録完了 answer_user_id: {:?}, answer_friend_id: {:?}, question_id: {:?}, name_display: {:?}",
      answer.answer_user_id.clone(),
      answer.answer_friend_id.clone(),
      answer.question_id.clone(),
      answer.name_display.clone()
  );

  Ok(result)
}


async fn reciprocal_followings_check(answer_user_id: &str, answer_friend_id: &str,  pool: &Pool<Postgres>) -> anyhow::Result<i64> {
  let count = sqlx::query(
    "
    SELECT count(friendship_friend_id) FROM friendship
    WHERE friendship_user_id = $1 AND friendship_friend_id = (SELECT user_id FROM user_information WHERE firebase_id = $2)
    "
  )
  .bind(answer_friend_id)
  .bind(answer_user_id)
  .map(|row: PgRow| row.get(0))
  .fetch_one(pool)
  .await?;

  tracing::info!(
    "相互フォローチェック answer_user_id: {:?}, answer_friend_id: {:?}, count: {:?}",
      answer_user_id,
      answer_friend_id,
      count
  );

Ok(count)
}