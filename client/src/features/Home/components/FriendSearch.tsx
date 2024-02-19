import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Container, Paper, Box, TextField } from '@mui/material'
import { getFriend } from '../../../lib/Http/Http'
import { Loading } from '../../../public/Loading/Loading'
import { Toast } from '../../../public/Toast/Toast'
import { FriendRegistration } from './FriendRegistration'
import { useQuery } from 'react-query'

export const FriendSearch = (props: { userID: string; userName: string }) => {
  const userContext = useAuthContext()
  const { error } = Toast()
  const [visible, setVisible] = useState(false)
  const [friendName, setFriendName] = useState('')
  const [friendID, setFriendID] = useState('')

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const { isLoading: isLoadingFriend, refetch: refetchFriend } =
    useQuery<Friend>(
      ['getfriend'],
      () => getFriend(friendID, userContext.uid),
      {
        enabled: false,
        notifyOnChangeProps: ['data'],
        retry: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          if (
            friendID === '' ||
            props.userID === friendID ||
            data.name === null
          ) {
            error('フレンドが存在しません')
            setVisible(false)
            setFriendName('')
            return
          } else {
            setFriendName(data.name)
            setVisible(true)
          }
        },
        onError: (e: any) => {
          alert(e.response.data)
          return
        },
      }
    )

  if (isLoadingFriend) {
    return <Loading />
  }

  const findFriend = () => {
    refetchFriend()
  }

  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <TextField
          type="text"
          label="フレンド検索"
          variant="standard"
          value={friendID}
          onChange={(e) => setFriendID(e.target.value)}
          onBlur={findFriend}
          style={{ width: '300px' }}
        />
        <Box component="main">
          {friendName}
          <FriendRegistration
            friendID={friendID}
            userInformationID={props.userID}
            visible={visible}
          />
        </Box>
      </Paper>
    </Container>
  )
}
