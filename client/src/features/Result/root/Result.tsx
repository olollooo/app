import React, { createContext } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Box, Container, Paper, Typography } from '@mui/material'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { Loading } from '@/public/Loading/Loading'
import { useQuery } from 'react-query'
import { answerResult } from '@/lib/Http/Http'

export const UserID = createContext('')

export const Result = () => {
  const userContext = useAuthContext()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const { data: dataAnswerResult, isLoading: isLoadingAnswerResult } = useQuery<
    AnswerResult[]
  >(['getanswerresult'], () => answerResult(userContext.uid), {
    notifyOnChangeProps: ['data'],
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (e: any) => {
      return alert(e.response.data)
    },
  })

  if (isLoadingAnswerResult) {
    return <Loading />
  }

  if (dataAnswerResult === undefined) {
    alert('ユーザ情報を取得出来ませんでした。お問い合わせ下さい。')
    return <Navigate to="/login" />
  }

  if (!userContext || !userContext.emailVerified) {
    return <Navigate to="/login" />
  } else {
    return (
      <>
        <MenuBar />

        <Box
          sx={{
            width: '100%',
            overflow: 'auto',
          }}
        >
          {dataAnswerResult.length === 0 ? (
            <Typography variant="h6">フレンドを追加しよう</Typography>
          ) : (
            <Box>
              <Box>
                {dataAnswerResult.map((value, i) => (
                  <Box key={i}>
                    <Container maxWidth="xs" sx={{ marginY: 4 }}>
                      <Paper sx={{ pl: 3, pt: 1, pb: 1, pr: 0, marginY: 3 }}>
                        {value.name_display ? (
                          <Box>・{value.name}</Box>
                        ) : (
                          <Box>・■■■</Box>
                        )}
                        <Box component="span">・{value.gender}</Box>
                        <Box>・{value.question_content}</Box>
                      </Paper>
                    </Container>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </>
    )
  }
}
