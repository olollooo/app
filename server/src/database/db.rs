use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::time::Duration;


pub async fn db_pool_connection() -> Pool<Postgres> {
  let port = std::env::var("PORT").unwrap_or_else(|e| {
    panic!(
      "{:?}",
      tracing::error!("DB接続時、portの取得に失敗しました。ErrorMessage: {}", e)
    )
  });


  let db_connection_str: String = if port == "3000" {
    std::env::var("DATABASE_URL").unwrap_or_else(|e| {
      panic!(
        "{:?}",
        tracing::error!("DB接続文字列を取得出来ませんでした。ErrorMessage: {}", e)
      )
    })
  } else {
    std::env::var("DATABASE_TEST_URL").unwrap_or_else(|e| {
      panic!(
        "{:?}",
        tracing::error!("テストDB接続文字列を取得出来ませんでした。ErrorMessage: {}", e)
      )
    })
  };

  let pool = PgPoolOptions::new()
    .max_connections(5)
    .idle_timeout(Duration::from_secs(5))
    .connect(&db_connection_str)
    .await
    .unwrap_or_else(|e| {
      println!("{}", e);
      panic!(
        "{:?}",
        tracing::error!("DBプール作成に失敗しました。ErrorMessage: {}", e)
      )
    });

  return pool;
}