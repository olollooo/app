import React, { useState } from 'react'
import { Box, Button, Container, Grid, TextField } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/Firebase/FireBase'
import { Link, useNavigate } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch {
      alert('メールアドレスまたは、パスワードが間違っています。')
    }
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value)
  }

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value)
  }
  return (
    <Container>
      <Grid container>
        <Grid item md={4}></Grid>
        <Grid item md={4}>
          <h2>ログイン</h2>
          <Box component="form">
            <TextField
              style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
              name="email"
              type="text"
              label="メールアドレス"
              variant="standard"
              fullWidth
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeEmail(event)
              }}
            />
            <TextField
              style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
              name="password"
              type="password"
              label="パスワード"
              variant="standard"
              fullWidth
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChangePassword(event)
              }}
            />
            <Button
              fullWidth
              variant="contained"
              style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
              onClick={handleLogin}
            >
              ログイン
            </Button>
            <Grid container>
              <Grid item>
                <Button variant="text" component={Link} to="/signup">
                  新規登録
                </Button>
              </Grid>
              <Grid item>
                <Button variant="text" component={Link} to="/contact">
                  お問い合わせ
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
