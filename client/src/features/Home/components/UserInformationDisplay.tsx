import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Paper, Box, IconButton, Tooltip, Container } from '@mui/material'
import { Loading } from '../../../public/Loading/Loading'
import { getNameAndUserIDFromUserInformation } from '../../../lib/Http/Http'

import { useQuery } from 'react-query'

export const UserInformationDisplay = (props: {
  setUserInformation: (arg: { name: string; user_id: string }) => void
}) => {
  const userContext = useAuthContext()
  const [title, setTitle] = useState('Copy to Clipboard')

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  // index.tsxの<React.StrictMode>で2回レンダリングで行われいる。本番環境だけだと問題なし。それか<React.StrictMode>を削除する
  const { data: dataUserInformation, isLoading: isLoadingUserInformation } =
    useQuery<GetUserInformationResult>(
      ['getuserinformation'],
      () => getNameAndUserIDFromUserInformation(userContext.uid),
      {
        notifyOnChangeProps: ['data'],
        // retry: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          props.setUserInformation({ name: data.name, user_id: data.user_id })
        },
        onError: (e: any) => {
          alert(e.response.data)
        },
      }
    )

  if (isLoadingUserInformation) {
    return <Loading />
  }

  if (dataUserInformation === undefined) {
    alert('ユーザ情報を取得出来ませんでした。お問い合わせ下さい。')
    return <Navigate to="/login" />
  }

  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(dataUserInformation.user_id)
    setTitle('Copy!')
    setTimeout(() => setTitle('Copy to Clipboard'), 1000)
  }

  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ fontSize: 16 }}>{dataUserInformation.name}</Box>
        <Tooltip title={title} placement="bottom" arrow>
          <IconButton size="small" onClick={() => copyToClipboard()}>
            <Box sx={{ fontSize: 12, m: 1 }}>{dataUserInformation.user_id}</Box>
          </IconButton>
        </Tooltip>
      </Paper>
    </Container>
  )
}
