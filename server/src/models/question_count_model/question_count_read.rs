use sqlx::{Pool, Postgres};

use crate::controllers::question_count_controller::types::QuestionCount;

pub async fn question_count_read(
  pool: &Pool<Postgres>,
  firebase_id: String,
  registration_time: String
) -> anyhow::Result<QuestionCount> {

  let result = sqlx::query_as::<_, QuestionCount>(
    r#"
    SELECT count(registration_time) FROM answer
    INNER JOIN user_information ON answer_user_id = user_id
    WHERE firebase_id = $1 AND registration_time = $2
    "#,
  )
  .bind(firebase_id.clone())
  .bind(registration_time.clone())
  .fetch_one(pool)
  .await?;

Ok(result)
}