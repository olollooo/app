//レスポンスデータの記法は、スネークケースで統一

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://0.0.0.0:3000",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Headers": "*",
  },
});

//SignUp.tsx
//新規ユーザの登録
export const create = async ({ name, email, password, gender }: UserInfo) => {
  const response = await apiClient.post<UserInfo>("/api/signup", { name, email, password, gender });
  return response.data;
}

//firebaseIDを登録
export const firebaseIDRegistration = async ({ firebase_id, email, password }: FirebaseID) => {
  const response = await apiClient.post<FirebaseID>("/api/firebase", { firebase_id, email, password });
  return response.data;
}

//ChangeEmailAddress.tsx
//メール変更
export const emailUpDate = async ({ password, email, old_email }: EmailChange) => {
  const response = await apiClient.put<EmailChange>("/api/emailsettings", { password, email, old_email });
  return response.data;
}

//ChangePassword.tsx
//パスワード変更
export const passwordUpDate = async ({ password, email }: PasswordChange) => {
  const response = await apiClient.put<PasswordChange>("/api/passwordsettings", { password, email });
  return response.data;
}


//ユーザ情報(name, user_id)取得
export const getNameAndUserIDFromUserInformation = async (firebase_id: string) => {
  const params = new URLSearchParams({
    firebaseid: firebase_id,
    })
  const response = await apiClient.get(`/api/getuserinformation?${params}`);
  return response.data;
}

//フレンド取得
export const getFriend = async (friend_id: string, firebase_id: string) => {
  const params = new URLSearchParams({
    friendid: friend_id,
    firebaseid: firebase_id
    })
  const response = await apiClient.get(`/api/friend?${params}`);
  return response.data;
}

//フレンド追加
export const addFriend = async ({ friendship_user_id, friendship_friend_id }: RelatedFriends) => {
  const response = await apiClient.post<RelatedFriends>("/api/addfriend", { friendship_user_id, friendship_friend_id });
  return response.data;
}

//フレンド一覧取得
export const friendsList = async (firebase_id: string) => {
  const params = new URLSearchParams({
    firebaseid: firebase_id,
    })
  const response = await apiClient.get(`/api/friendslist?${params}`);
  return response.data;
}

//フレンド削除
export const deleteFriend = async ({friendship_user_id, friendship_friend_id}: DeleteFriend) => {
  const params = new URLSearchParams({
    friendshipuserid: friendship_user_id,
    friendshipfriendid: friendship_friend_id
    })
  const response = await apiClient.delete(`/api/deletefriend?${params}`);
  return response.data;
}

//質問回数取得
export const questionCount = async (firebase_id: string, registration_time: string) => {
  const params = new URLSearchParams({
    firebaseid: firebase_id,
    registrationtime: registration_time
    })
  const response = await apiClient.get(`/api/questioncount?${params}`);
  return response.data;
}

//質問取得
export const questionContent = async () => {
  const response = await apiClient.get(`/api/questioncontent`);
  return response.data;
}

//解答登録
export const addAnswer = async ({ answer_user_id, answer_friend_id, question_id, name_display, registration_time }: Answer) => {
  const response = await apiClient.post<Answer>("/api/addanswer", { answer_user_id, answer_friend_id, question_id, name_display, registration_time });
  return response.data;
}

//称賛一覧
export const answerResult = async (firebase_id: string) => {
  const params = new URLSearchParams({
    firebaseid: firebase_id,
    })
  const response = await apiClient.get(`/api/answerresult?${params}`);
  return response.data;
}