import { passwordUpDate } from '@/lib/Http/Http'
import { Button, Container, Grid, Paper, Stack, TextField } from '@mui/material'
import { FirebaseError } from 'firebase/app'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import React, { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { auth } from '@/lib/Firebase/FireBase'
import { useNavigate } from 'react-router-dom'

export const ChangePassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const { control, handleSubmit } = useForm<PasswordChange>({
    defaultValues: { password: '', email: '' },
  })

  const passwordChange = (e: { target: { value: string } }) => {
    setPassword(() => e.target.value)
  }

  //検証ルールを指定
  const validationRules = {
    password: {
      required: 'パスワードを入力してください。',
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[.?/-])[a-zA-Z0-9.?/-]{8,24}$/,
        message:
          '大文字、記号を1つ以上含めてください。使える記号(ピリオド(.)、スラッシュ(/)、クエスチョンマーク(?)、ハイフン(-))',
      },
      minLength: {
        value: 8,
        message: 'パスワードは8文字以上入力してください。',
      },
    },
    email: {
      required: 'メールアドレスを入力してください。',
    },
  }

  const mutation = useMutation(passwordUpDate)
  const onSubmit: SubmitHandler<PasswordChange> = useCallback(
    (data: PasswordChange) => {
      mutation.mutate(data, {
        onSuccess: async (data) => {
          try {
            const user = auth.currentUser
            if (user === null || user.email === null) {
              return
            }

            const credential = EmailAuthProvider.credential(
              user.email,
              password
            )

            await reauthenticateWithCredential(user, credential)
            updatePassword(user, data.password)

            alert('パスワード更新完了')
            navigate('/')
          } catch (e: any) {
            if (e instanceof FirebaseError) {
              alert('FirebaseError: エラーが発生しました。お問い合わせください')
            }
          }
        },
        onError: (e: any) => {
          alert(e.response.data)
        },
      })
    },
    [mutation]
  )

  return (
    <>
      <MenuBar />
      <Container maxWidth="md" sx={{ marginY: 4 }}>
        <Paper sx={{ padding: 3 }}>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <h2>パスワード更新</h2>
            <Stack
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              spacing={2}
            >
              <Controller
                name="email"
                control={control}
                rules={validationRules.email}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="現在のメールアドレス"
                    variant="standard"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <TextField
                type="password"
                label="現在のパスワード"
                variant="standard"
                value={password}
                onChange={passwordChange}
              />
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="新しいパスワード"
                    variant="standard"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Button variant="contained" type="submit">
                更新する
              </Button>
            </Stack>
          </Grid>
        </Paper>
      </Container>
    </>
  )
}
