import { emailUpDate } from '@/lib/Http/Http'
import { Button, Container, Grid, Paper, Stack, TextField } from '@mui/material'
import { FirebaseError } from 'firebase/app'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from 'firebase/auth'
import React, { useCallback, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { auth } from '@/lib/Firebase/FireBase'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

export const ChangeEmailAddress = () => {
  const userContext = useAuthContext()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<EmailChange>({
    defaultValues: { password: '', email: '', old_email: '' },
  })

  //検証ルールを指定
  const validationRules = {
    password: {
      required: 'パスワードを入力してください。',
    },
    oldEmail: {
      required: 'メールアドレスを入力してください。',
    },
    newEmail: {
      required: 'メールアドレスを入力してください。',
    },
  }

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  useEffect(() => {
    if (userContext.emailVerified === false) {
      navigate('/login')
    }
  }, [])

  const mutation = useMutation(emailUpDate)
  const onSubmit: SubmitHandler<EmailChange> = useCallback(
    (data: EmailChange) => {
      mutation.mutate(data, {
        onSuccess: async (data) => {
          try {
            const user = auth.currentUser
            if (user === null || user.email === null) {
              return
            }

            const credential = EmailAuthProvider.credential(
              user.email,
              data.password
            )

            await reauthenticateWithCredential(user, credential)
            updateEmail(user, data.email)

            navigate('/mailaddresschksetting')
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
            <h2>メールアドレス更新</h2>
            <Stack
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              spacing={2}
            >
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="パスワード"
                    variant="standard"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="old_email"
                control={control}
                rules={validationRules.oldEmail}
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
              <Controller
                name="email"
                control={control}
                rules={validationRules.newEmail}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="新しいメールアドレス"
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
