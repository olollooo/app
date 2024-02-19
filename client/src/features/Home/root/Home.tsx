import React, { createContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Stack } from '@mui/material'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { UserInformationDisplay } from '../components/UserInformationDisplay'
import { FriendSearch } from '../components/FriendSearch'
import { ListOfFriends } from '../components/ListOfFriends'

export const UserID = createContext('')

export const Home = () => {
  const userContext = useAuthContext()
  const [userInformation, setUserInformation] =
    useState<GetUserInformationResult>({
      name: '',
      user_id: '',
    })

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  if (!userContext || !userContext.emailVerified) {
    return <Navigate to="/login" />
  } else {
    return (
      <Stack>
        <MenuBar />
        <UserInformationDisplay setUserInformation={setUserInformation} />
        <FriendSearch
          userID={userInformation.user_id}
          userName={userInformation.name}
        />
        <ListOfFriends userID={userInformation.user_id} />
      </Stack>
    )
  }
}
