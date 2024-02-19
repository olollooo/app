import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  Container,
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
import { questionContent } from '../../../lib/Http/Http'

type Props = {
  value: number
  onChange: (event: SelectChangeEvent<number>) => void
}

export const QuestionSelection = (props: Props) => {
  const userContext = useAuthContext()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const { data: dataQuestionList, isLoading: isLoadingQuestionList } = useQuery<
    QuestionContent[]
  >(['getquestioncontent'], () => questionContent(), {
    onError: (e: any) => {
      return alert(e.response.data)
    },
  })

  if (isLoadingQuestionList) {
    return <Loading />
  }

  if (dataQuestionList === undefined) {
    alert('ユーザ情報を取得出来ませんでした。お問い合わせ下さい。')
    return <Navigate to="/login" />
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
          <FormControl sx={{ minWidth: 320 }}>
            <InputLabel>content</InputLabel>
            <Select
              value={props.value}
              label="question"
              onChange={(e) => props.onChange(e)}
            >
              {dataQuestionList.map((value) => (
                <MenuItem key={value.id} value={value.id}>
                  {value.question_content}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  )
}
