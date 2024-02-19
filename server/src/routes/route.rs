use axum::{extract::Extension, http::Method, routing::{post, get, delete}, Router};
use std::sync::Arc;
use tower_http::{cors::Any, cors::CorsLayer};

use crate::controllers;
use crate::database;

pub async fn route() -> Router {
  let pool = Arc::new(database::db::db_pool_connection().await);

  let cors = CorsLayer::new()
    .allow_headers(Any)
    .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
    .allow_origin(Any)
    .allow_credentials(false);

  let app = Router::new()
    .route(
      "/api/signup",
      post(controllers::signup_controller::user_create_controller::user_create_controller),
    )
    .route(
      "/api/emailsettings",
      post(controllers::email_settings_controller::email_update_controller::email_update_controller),
    )
    .route(
      "/api/passwordsettings",
      post(controllers::password_settings_controller::password_update_controller::password_update_controller),
    )
    .route("/api/firebase", post(controllers::firebase_controller::firebase_create_controller::firebase_create_controller),
    )
    .route("/api/getuserinformation", get(controllers::get_user_information_controller::name_and_id_read_controller::name_and_id_read_controller),
    )
    .route("/api/friend", get(controllers::find_friend_controller::friend_name_read_controller::friend_name_read_controller),
    )
    .route(
      "/api/addfriend",
      post(controllers::add_friend_controller::friend_create_controller::friend_create_controller),
    )
    .route("/api/friendslist", get(controllers::friends_list_controller::friends_list_read_controller::friends_list_read_controller),
    )
    .route("/api/deletefriend", delete(controllers::delete_friend_controller::friend_delete_controller::friend_delete_controller),
    )
    .route("/api/questioncount", get(controllers::question_count_controller::question_count_read_controller::question_count_read_controller),
    )
    .route("/api/questioncontent", get(controllers::question_content_controller::question_content_read_controller::question_count_read_controller),
    )
    .route("/api/addanswer", post(controllers::add_answer_controller::answer_create_controller::answer_create_controller),
    )
    .route("/api/answerresult", get(controllers::get_answer_controller::answer_read_controller::answer_read_controller),
    )
    .layer(cors)
    .layer(Extension(pool));

  return app;
}
