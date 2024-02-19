use sqlx::{Pool, Postgres};

use crate::controllers::get_answer_controller::types::Answer;
use crate::controllers::get_answer_controller::types::AnswerCount;

pub async fn answer_read(
  pool: &Pool<Postgres>,
  firebase_id: String,
) -> anyhow::Result<Vec<Answer>> {
  
  let answer_count = answer_count_read(pool, firebase_id.clone());

  let count = match answer_count.await {
    Ok(ok) => ok,
    Err(e) => return Err(e)
  };

  if count < 30 {
    let result = match answer_display_read(pool, firebase_id.clone()).await {
      Ok(ok) => ok,
      Err(e) => return Err(e)
    };
    
    Ok(result)
  } else {

    match answer_delete(pool, firebase_id.clone(), count).await {
      Ok(()) => {
        let result = match answer_display_read(pool, firebase_id.clone()).await {
          Ok(ok) => ok,
          Err(e) => return Err(e)
        };
        
        Ok(result)
      },
      Err(e) => return Err(e)
    }
    
  }
}

async fn answer_count_read(pool: &Pool<Postgres>, firebase_id: String) -> anyhow::Result<i64> {
  let answer_count = sqlx::query_as::<_, AnswerCount>(
    r#"
    SELECT count(answer_user_id) FROM answer WHERE answer_user_id = (SELECT user_id FROM user_information where firebase_id = $1)
    "#,
  )
  .bind(firebase_id.clone())
  .fetch_one(pool)
  .await?;

  Ok(answer_count.count)
}

async fn answer_display_read(pool: &Pool<Postgres>, firebase_id: String) -> anyhow::Result<Vec<Answer>> {
  let result = sqlx::query_as::<_, Answer>(
    r#"
    SELECT (SELECT name FROM user_information where user_id = answer_user_id), (SELECT gender FROM user_information where user_id = answer_friend_id), question.question_content, answer.name_display, answer_friend_id FROM answer 
    INNER JOIN question ON question.id = answer.question_id
    WHERE answer.answer_friend_id = (SELECT friendship_friend_id FROM friendship WHERE friendship_friend_id = (SELECT user_id FROM user_information WHERE firebase_id = $1))
    "#,
    
  )
  .bind(firebase_id.clone())
  .fetch_all(pool)
  .await?;

  Ok(result)
}

async fn answer_delete(pool: &Pool<Postgres>, firebase_id: String, count: i64) -> anyhow::Result<(), anyhow::Error> {
  let mut transaction = pool.begin().await?;

  let remaining_count = count - 30;

  sqlx::query("DELETE FROM answer WHERE id 
  IN (SELECT id FROM answer ORDER BY CAST(public.answer.registration_time AS timestamp), id ASC LIMIT $1) 
  AND answer_user_id = (SELECT user_id FROM user_information where firebase_id = $2) 
  ")
  .bind(remaining_count)
  .bind(firebase_id.clone())
  .execute(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "称賛表示の最大値を超えたので削除 firebase_id: {:?}, 削除した数: {:?}",
      firebase_id.clone(),
      remaining_count
  );


  Ok(())
}