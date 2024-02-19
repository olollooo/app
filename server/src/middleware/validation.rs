use async_trait::async_trait;
use axum::body::HttpBody;
use axum::BoxError;
use axum::{
  extract::FromRequest,
  http::{Request, StatusCode},
  Json,
};
use serde::de::DeserializeOwned;
use validator::Validate;

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidatedJson<T>(pub T);

#[async_trait]
impl<T, S, B> FromRequest<S, B> for ValidatedJson<T>
where
  T: DeserializeOwned + Validate,
  B: HttpBody + Send + 'static,
  B::Data: Send,
  B::Error: Into<BoxError>,
  S: Send + Sync,
{
  type Rejection = (StatusCode, String);

  async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
    let Json(value) = Json::<T>::from_request(req, state)
      .await
      .map_err(|rejection| {
        let message = format!("Json parse error: {}. お問い合わせ下さい。", rejection);
        tracing::error!("Json parse error: {:?}", &message);
        (StatusCode::BAD_REQUEST, message)
      })?;
    value.validate().map_err(|rejection| {
      let message =
        format!("Validation error: {}. お問い合わせ下さい。", rejection).replace('\n', ", ");
      tracing::error!("Validation error: {:?}", &message);
      (StatusCode::BAD_REQUEST, message)
    })?;
    Ok(ValidatedJson(value))
  }
}
