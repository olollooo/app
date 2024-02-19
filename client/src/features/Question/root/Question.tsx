import React, { useState } from 'react'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { FriendSelection } from '../components/FriendSelection'
import { QuestionSelection } from '../components/QuestionSelection'
import { DisplayCheck } from '../components/DisplayCheck'
import { Container, Paper, Box, SelectChangeEvent, Grid } from '@mui/material'
import { PraiseButton } from '../components/PraiseButton'

export const Question = () => {
  const [question, setquestion] = React.useState<number>(1)
  const [friend, setFriend] = React.useState('')
  const [isCheckedDisplay, setIsCheckedDisplay] = useState<boolean>(false)

  const handleChangeQuestion = (e: SelectChangeEvent<number>) => {
    setquestion(Number(e.target.value))
  }

  const handleChangeFriend = (e: SelectChangeEvent) => {
    setFriend(e.target.value as string)
  }

  const handleChangeDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedDisplay(e.target.checked)
  }

  return (
    <>
      <MenuBar />
      <Container maxWidth="md" sx={{ marginY: 4 }}>
        <Paper sx={{ pl: 3, pt: 1, pb: 0, pr: 0 }}>
          <Box
            sx={{
              width: '100%',
              height: 400,
              overflow: 'auto',
            }}
          >
            <QuestionSelection
              value={question}
              onChange={(e) => handleChangeQuestion(e)}
            />
            <Container maxWidth="md" sx={{ marginY: 4 }}>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <FriendSelection
                  value={friend}
                  onChange={(e) => handleChangeFriend(e)}
                />
                <DisplayCheck onChange={(e) => handleChangeDisplay(e)} />
                <PraiseButton
                  question={question}
                  friend={friend}
                  isCheckedDisplay={isCheckedDisplay}
                />
              </Grid>
            </Container>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
