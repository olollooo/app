use sqlx::{Pool, Postgres};

use crate::controllers::question_content_controller::types::QuestionContent;

pub async fn question_content_read(
  pool: &Pool<Postgres>,
) -> anyhow::Result<Vec<QuestionContent>> {

  let result = sqlx::query_as::<_, QuestionContent>(
    r#"
    SELECT id, question_content FROM question WHERE delete_flag = false
    "#,
  )
  .fetch_all(pool)
  .await?;

Ok(result)
}