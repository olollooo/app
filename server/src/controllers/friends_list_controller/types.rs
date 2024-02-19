use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, sqlx::FromRow)]
pub struct FriendsList {
  pub name: Option<String>,
  pub friendship_friend_id: Option<String>
}
