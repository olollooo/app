import { Button, Container, Grid, Paper, Stack } from '@mui/material'
import React, { useState } from 'react'
import { init, send } from '@emailjs/browser'
import { MenuBar } from '../../../public/MenuBar/MenuBar'
import { InquiryDetails } from '../components/InquiryDetails'
import { CommonTextField } from '../hooks/CommonTextField'

export const Contact = () => {
  const [name, setName] = useState('')
  const [uuid, setUuid] = useState('')
  const [email, setEmail] = useState('')
  const [textarea, setTextarea] = useState('')
  const userID = process.env.REACT_APP_USER_ID
  const serviceID = process.env.REACT_APP_SERVICE_ID
  const templateID = process.env.REACT_APP_TEMPLATE_ID

  const nameChange = (e: { target: { value: string } }) => {
    setName(() => e.target.value)
  }

  const uuidChange = (e: { target: { value: string } }) => {
    setUuid(() => e.target.value)
  }

  const emailChange = (e: { target: { value: string } }) => {
    setEmail(() => e.target.value)
  }

  const textareaChange = (e: { target: { value: string } }) => {
    setTextarea(() => e.target.value)
  }

  const emailSend = () => {
    try {
      if (userID && serviceID && templateID) {
        // emailjsのUser_IDを使って初期化
        init(userID)

        // emailjsのテンプレートに渡すパラメータを宣言
        const templateParams = {
          from_name: name,
          from_uuid: uuid,
          reply_to: email,
          message: textarea,
        }

        // ServiceId,Template_ID,テンプレートに渡すパラメータを引数にemailjsを呼び出し
        send(serviceID, templateID, templateParams)

        alert('お問合せメール送信しました。')
      } else {
        alert('入力情報が正しく送信出来ませんでした')
      }
    } catch (e: any) {
      alert('お問い合わせメール送信に失敗しました')
    }
  }

  return (
    <>
      <MenuBar />
      <Container maxWidth="md" sx={{ marginY: 4 }}>
        <Paper sx={{ padding: 3 }}>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <h2>お問い合わせ</h2>
            <Stack spacing={2}>
              <CommonTextField
                value={name}
                onChange={(e: { target: { value: string } }) => nameChange(e)}
                label="名前"
                placeholder='"返信用の名前を記入して下さい"'
              />

              <CommonTextField
                value={uuid}
                onChange={(e: { target: { value: string } }) => uuidChange(e)}
                label="ユーザID"
                placeholder="アカウント作成済み場合ご記入下さい"
              />

              <CommonTextField
                value={email}
                onChange={(e: { target: { value: string } }) => emailChange(e)}
                label="メールアドレス"
                placeholder="返信用のメールアドレスを記入して下さい"
              />

              <InquiryDetails
                value={textarea}
                onChange={(e: { target: { value: string } }) =>
                  textareaChange(e)
                }
              />

              <Button variant="contained" onClick={emailSend}>
                メールを送る
              </Button>
            </Stack>
          </Grid>
        </Paper>
      </Container>
    </>
  )
}
