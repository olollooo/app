import React from 'react'
import { Button, Container, Grid, Paper, Stack } from '@mui/material'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Navigate } from 'react-router-dom'
import { Loading } from '@/public/Loading/Loading'
import { useQuery } from 'react-query'
import { questionCount } from '../../../lib/Http/Http'
import { useNavigate } from 'react-router-dom'

export const QuestionCount = () => {
  const userContext = useAuthContext()
  const navigate = useNavigate()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const todayDate = yyyy + '/' + mm + '/' + dd

  const { data: dataQuestionCount, isLoading: isLoadingQuestionCount } =
    useQuery<QuestionCount>(
      ['questioncount'],
      () => questionCount(userContext.uid, todayDate),
      {
        notifyOnChangeProps: ['data'],
        // retry: false,
        refetchOnWindowFocus: false,
        onError: (e: any) => {
          alert(e.response.data)
        },
      }
    )

  if (isLoadingQuestionCount) {
    return <Loading />
  }

  if (dataQuestionCount === undefined) {
    alert('質問回数を取得出来ませんでした。お問い合わせ下さい。')
    return <Navigate to="/login" />
  }

  const screenTransitionHander = () => {
    if (dataQuestionCount.count >= 3) {
      alert('今日の回数は上限に達しています')
      return
    }
    navigate('/question')
  }

  return (
    <Stack>
      <MenuBar />
      <Container maxWidth="md" sx={{ marginY: 4 }}>
        <Paper sx={{ padding: 3 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Grid item xs={8}>
              <Button variant="contained" onClick={screenTransitionHander}>
                称賛を送る
              </Button>
            </Grid>
            <Grid item xs={8}>
              {dataQuestionCount.count}/3
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Stack>
  )
}
