import React from 'react'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Navigate } from 'react-router-dom'
import { Button, Container, Grid } from '@mui/material'
import { useMutation } from 'react-query'
import { addAnswer } from '@/lib/Http/Http'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../../public/Toast/Toast'

export const PraiseButton = (props: {
  question: number
  friend: string
  isCheckedDisplay: boolean
}) => {
  const userContext = useAuthContext()
  const navigate = useNavigate()
  const { success } = Toast()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const mutation = useMutation(addAnswer, {
    onSuccess: () => {
      success('送りました')
      navigate('/startofquestion')
    },
    onError: (e: any) => {
      alert(e.response.data)
    },
  })

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayDate = yyyy + '/' + mm + '/' + dd

  const answer: Answer = {
    answer_user_id: userContext.uid,
    answer_friend_id: props.friend,
    question_id: props.question,
    name_display: props.isCheckedDisplay,
    registration_time: todayDate,
  }

  const addAnswerHander = () => {
    mutation.mutate(answer)
  }

  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={8}>
          <Button variant="contained" onClick={addAnswerHander}>
            送る
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
