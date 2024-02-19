type UserInfo = {
  name: string,
  email: string,
  password: string,
  gender: string
}

type EmailChange = {
  password: string,
  email: string,
  old_email: string,
}

type PasswordChange = {
  password: string,
  email: string,
}

type FirebaseID = {
  firebase_id: string,
  password: string,
  email: string,
}

type GetUserInformationResult = {
  name: string,
  user_id: string,
}

type Friend = {
  name: string
}

type RelatedFriends = {
  friendship_user_id: string,
  friendship_friend_id: string
}

type FriendsListResult = {
  name: string
  friendship_friend_id: string
}

type DeleteFriend = {
  friendship_user_id: string,
  friendship_friend_id: string
}

type QuestionCount = {
  count: number,
  registration_time: string
}

type QuestionContent = {
  id: number,
  question_content: string
}

type Answer = {
  answer_user_id: string,
  answer_friend_id: string,
  question_id: number,
  name_display: boolean,
  registration_time: string
}

type AnswerResult = {
  name: string,
  question_content: string,
  name_display: boolean,
  answer_friend_id: string,
  gender: string
}