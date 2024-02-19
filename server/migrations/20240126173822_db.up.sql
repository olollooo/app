CREATE TABLE user_information (
  id serial PRIMARY key NOT null,
  name varchar(15) NOT null UNIQUE,
  email varchar(30) NOT null UNIQUE,
  password varchar(15) NOT null,
  gender varchar(5) NOT null,
  firebase_id varchar(40) UNIQUE,
  user_id varchar(15) NOT null unique
);

CREATE TABLE friendship (
  friendship_user_id varchar(15) references user_information(user_id) NOT null,
  friendship_friend_id varchar(15) references user_information(user_id) NOT null
);

CREATE TABLE question (
  id serial PRIMARY key NOT null,
  question_content varchar(50) NOT null,
  delete_flag boolean NOT null
);

CREATE TABLE answer (
  id serial PRIMARY KEY NOT null,
  answer_user_id varchar(15) NOT null,
  answer_friend_id varchar(15) NOT null,
  question_id int references question(id),
  name_display boolean NOT null,
  registration_time varchar(20) NOT null
);

INSERT INTO question (question_content, delete_flag) VALUES('笑顔が良かった', false);
INSERT INTO question (question_content, delete_flag) VALUES('服装が完璧', false);
INSERT INTO question (question_content, delete_flag) VALUES('会話が面白い', false);
