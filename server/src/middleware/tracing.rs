use std::fs::File;
use tracing_subscriber::{
  fmt::{self, writer::MakeWriterExt},
  layer::SubscriberExt,
};

pub async fn create_tracing() {
  let system_log = File::create(format!(
    // docker環境のURL
    // ローカル環境で実行する場合は変更する
    "/app/log/system_{}.md",
    chrono::Local::now().format("[%Y-%m-%d]")
  ))
  .unwrap_or_else(|e| {
    panic!(
      "{:?}",
      tracing::error!(
        "システムログファイル作成に失敗しました。ErrorMessage: {}",
        e
      )
    )
  });
  let user_log = File::create(format!(
    // docker環境のURL
    // ローカル環境で実行する場合は変更する
    "/app/log/user_{}.md",
    chrono::Local::now().format("[%Y-%m-%d]")
  ))
  .unwrap_or_else(|e| {
    panic!(
      "{:?}",
      tracing::error!("ユーザログファイル作成に失敗しました。ErrorMessage: {}", e)
    )
  });

  let subscriber = tracing_subscriber::registry()
    .with(
      fmt::Layer::new()
        .with_writer(system_log.with_max_level(tracing::Level::TRACE))
        .with_ansi(false)
        .json(),
    )
    .with(
      fmt::Layer::new()
        .with_writer(user_log.with_max_level(tracing::Level::INFO))
        .with_ansi(false),
    );

  tracing::subscriber::set_global_default(subscriber).unwrap_or_else(|e| {
    panic!(
      "{:?}",
      tracing::error!(
        "グローバルサブスクライバーを設定出来ませんでした。ErrorMessage: {}",
        e
      )
    )
  });
}

// tracing_subscriber::registry()
//   .with(tracing_subscriber::EnvFilter::new(
//     std::env::var("RUST_LOG").unwrap_or_else(|_| "example_tokio_postgres=debug".into()),
//   ))
//   .with(tracing_subscriber::fmt::layer())
//   .init();
