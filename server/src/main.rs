use dotenv::dotenv;
use std::net::SocketAddr;

mod controllers;
mod database;
mod middleware;
mod models;
mod public;
mod routes;
mod services;

#[tokio::main]
async fn main() {
  dotenv().ok();

  middleware::tracing::create_tracing().await;

  let port = std::env::var("PORT")
    .ok()
    .and_then(|s| s.parse().ok())
    .unwrap_or(3000);

  let addr = SocketAddr::from(([0,0,0,0], port));
  tracing::info!("listening on {}", addr);
  axum::Server::bind(&addr)
    .serve(routes::route::route().await.into_make_service())
    .await
    .unwrap();
}