import React from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Paper, Box, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Loading } from '../../../public/Loading/Loading'
import { friendsList } from '../../../lib/Http/Http'
import { DeleteFriend } from './DeleteFriend'

export const ListOfFriends = (props: { userID: string }) => {
  const userContext = useAuthContext()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const { data: dataFriendsList, isLoading: isLoadingFriendsList } = useQuery<
    FriendsListResult[]
  >(['getfriendslist'], () => friendsList(userContext.uid), {
    onError: (e: any) => {
      return alert(e.response.data)
    },
  })

  if (isLoadingFriendsList) {
    return <Loading />
  }

  if (dataFriendsList === undefined) {
    alert('ユーザ情報を取得出来ませんでした。お問い合わせ下さい。')
    return <Navigate to="/login" />
  }

  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper sx={{ pl: 3, pt: 1, pb: 0, pr: 0 }}>
        <Box
          sx={{
            width: '100%',
            height: 400,
            overflow: 'auto',
          }}
        >
          {dataFriendsList.length === 0 ? (
            <Typography variant="h6">フレンドを追加しよう</Typography>
          ) : (
            <Box>
              {dataFriendsList.map((value) => (
                <Box key={value.friendship_friend_id}>
                  <Box>
                    {value.name}
                    <Box component="span">
                      <DeleteFriend
                        userID={props.userID}
                        friendID={value.friendship_friend_id}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  )
}
