use sqlx::{Pool, Postgres};

use crate::controllers::email_settings_controller::types::{EmailSettings, EmailSettingsResult};

pub async fn email_update(
  pool: &Pool<Postgres>,
  email_chg: &EmailSettings,
) -> anyhow::Result<EmailSettingsResult> {
  let mut transaction = pool.begin().await?;

  let result = sqlx::query_as::<_, EmailSettingsResult>(
    r#"
      UPDATE user_information SET email = $1 WHERE email = $2 AND password = $3
      returning *
      "#,
  )
  .bind(email_chg.email.clone())
  .bind(email_chg.old_email.clone())
  .bind(email_chg.password.clone())
  .fetch_one(&mut transaction)
  .await?;

  transaction.commit().await?;

  tracing::info!(
    "メールアドレス更新完了 new_email: {:?}, old_email: {:?}",
    email_chg.email.clone(),
    email_chg.old_email.clone(),
  );

  Ok(result)
}
