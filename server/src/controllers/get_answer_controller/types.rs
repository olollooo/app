use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow)]
pub struct Answer {
  pub name: Option<String>,
  pub question_content: Option<String>,
  pub name_display: Option<bool>,
  pub answer_friend_id: Option<String>,
  pub gender: Option<String>
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow)]
pub struct AnswerCount {
  pub count: i64
}
