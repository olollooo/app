import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  SelectChangeEvent,
} from '@mui/material'
import { useQuery } from 'react-query'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Loading } from '../../../public/Loading/Loading'
import { friendsList } from '../../../lib/Http/Http'

type Props = {
  value: string
  onChange: (event: SelectChangeEvent) => void
}

export const FriendSelection = (props: Props) => {
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
    <>
      {dataFriendsList.length === 0 ? (
        <Typography variant="h6">フレンドを追加しよう</Typography>
      ) : (
        <>
          <Grid item xs={8}>
            <FormControl sx={{ minWidth: 320 }}>
              <InputLabel>friend</InputLabel>
              <Select
                value={props.value}
                label="friend"
                onChange={(e) => props.onChange(e)}
              >
                {dataFriendsList.map((value) => (
                  <MenuItem
                    key={value.friendship_friend_id}
                    value={value.friendship_friend_id}
                  >
                    {value.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
    </>
  )
}

{
  /* <Box>
                {dataFriendsList.map((value) => (
                  <Box key={value.friendship_friend_id}>
                    <Box>
                      {value.name}
                      <Box component="span"></Box>
                    </Box>
                  </Box>
                ))}
              </Box> */
}
