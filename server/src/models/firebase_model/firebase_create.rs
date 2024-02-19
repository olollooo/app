use sqlx::{Pool, Postgres};

use crate::controllers::firebase_controller::types::FirebaseID;

pub async fn firebase_create(
  pool: &Pool<Postgres>,
  firebase: &FirebaseID,
) -> anyhow::Result<FirebaseID> {
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, FirebaseID>(
    r#"
      UPDATE user_information SET firebase_id = $1 WHERE email = $2 AND password = $3
      returning *
      "#,
  )
  .bind(firebase.firebase_id.clone())
  .bind(firebase.email.clone())
  .bind(firebase.password.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "firebase登録完了 firebase_id: {:?}",
    firebase.firebase_id.clone(),
  );

  Ok(result)
}
