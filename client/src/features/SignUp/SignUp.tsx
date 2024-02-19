import React, { useCallback, useState } from 'react'
import {
  Stack,
  TextField,
  Button,
  Container,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '@/lib/Firebase/FireBase'
import { FirebaseError } from 'firebase/app'
import {
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { useMutation } from 'react-query'
import { create } from '../../lib/Http/Http'
import { firebaseIDRegistration } from '../../lib/Http/Http'
import { PopUpComponent } from './components/PopUp'
import { PrivacyPolicy } from '../PrivacyPolicy/PrivacyPolicy'
import { TermsOfService } from '../TermsOfService/TermsOfService'

export const SignUp = () => {
  const [isOpen, setIsOpen] = useState(false)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }
  const navigate = useNavigate()
  const [isCheckedPrivacy, setIsCheckedPrivacy] = useState<boolean>(false)
  const [isCheckedTerms, setIsCheckedTerms] = useState<boolean>(false)

  //useFormで必要な関数を取得し、デフォルト値を指定
  const { control, handleSubmit } = useForm<UserInfo>({
    defaultValues: { name: '', email: '', password: '', gender: 'man' },
  })

  //検証ルールを指定
  const validationRules = {
    name: {
      required: '名前を入力してください。',
    },
    email: {
      required: 'メールアドレスを入力してください。',
    },
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
  }

  const mutation = useMutation(create)
  const firebaseMutation = useMutation(firebaseIDRegistration, {
    onSuccess: () => {
      navigate('/mailaddresschk')
    },
    onError: (_e) => {
      alert('ApiError: firebase登録に失敗しました')
      return
    },
  })

  const onSubmit: SubmitHandler<UserInfo> = useCallback(
    (data: UserInfo) => {
      if (isCheckedPrivacy === false) {
        alert('プライバシーポリシーに同意して下さい')
        return
      }
      if (isCheckedTerms === false) {
        alert('利用規約に同意して下さい')
        return
      }

      mutation.mutate(data, {
        onSuccess: async (data) => {
          try {
            // 登録の確認
            const providers = await fetchSignInMethodsForEmail(auth, data.email)
            if (
              providers.findIndex(
                (userCheck) =>
                  userCheck === EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
              ) !== -1
            ) {
              alert('すでに登録されているようです')
              return
            }
            // アカウント作成
            await createUserWithEmailAndPassword(
              auth,
              data.email,
              data.password
            )

            if (auth.currentUser === null) {
              return
            }

            const firebaseID: FirebaseID = {
              firebase_id: auth.currentUser.uid.toString(),
              email: data.email,
              password: data.password,
            }

            firebaseMutation.mutate(firebaseID)
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

  // const registerForSession = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const sessionEmail: SessionParams = {
  //     email: event.currentTarget.value.toString(),
  //   }
  //   mutationSession.mutate(sessionEmail)
  // }

  // const mutationSession = useMutation(session, {
  //   onSuccess: () => {
  //     // `posts`キーのクエリを無効化して再取得
  //     // queryClient.invalidateQueries('posts');
  //   },
  //   onError: (_e) => {
  //     alert('ApiError: session登録に失敗しました')
  //   },
  // })
  return (
    <Container>
      <Grid container>
        <Grid item md={4}></Grid>
        <Grid item md={4}>
          <h2>新規登録</h2>
          <Stack
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
          >
            <Controller
              name="name"
              control={control}
              rules={validationRules.name}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  label="名前"
                  variant="standard"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="text"
                  label="メールアドレス"
                  variant="standard"
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  // onChange={(e) => {
                  //   field.onChange(e)
                  //   registerForSession(e)
                  // }}
                />
              )}
            />
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
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  defaultValue="man"
                  row
                >
                  <FormControlLabel
                    {...field}
                    value="man"
                    control={<Radio />}
                    label="男性"
                  />
                  <FormControlLabel
                    {...field}
                    value="woman"
                    control={<Radio />}
                    label="女性"
                  />
                  <FormControlLabel
                    {...field}
                    value="other"
                    control={<Radio />}
                    label="その他"
                  />
                </RadioGroup>
              )}
            />
            <Grid container>
              <Grid item>
                <Checkbox
                  checked={isCheckedPrivacy}
                  onChange={() =>
                    setIsCheckedPrivacy((prevState) => !prevState)
                  }
                />
                <Button variant="text" onClick={togglePopup}>
                  プライバシーポリシー
                </Button>
              </Grid>
              <Grid item>
                <Checkbox
                  checked={isCheckedTerms}
                  onChange={() => setIsCheckedTerms((prevState) => !prevState)}
                />
                <Button variant="text" onClick={togglePopup}>
                  利用規約
                </Button>
              </Grid>
            </Grid>
            <Button variant="contained" type="submit">
              登録する
            </Button>
            <Grid container>
              <Grid item>
                <Button variant="text" component={Link} to="/login">
                  ログイン
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
      {isOpen && (
        <PopUpComponent content={<PrivacyPolicy />} handleClose={togglePopup} />
      )}
      {isOpen && (
        <PopUpComponent
          content={<TermsOfService />}
          handleClose={togglePopup}
        />
      )}
    </Container>
  )
}
