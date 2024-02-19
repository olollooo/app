import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { sendEmailVerification } from 'firebase/auth'
import { useAuthContext } from '@/provider/AuthProvider/AuthProvider'

export const ConfirmEmailAddress = () => {
  const navigate = useNavigate()
  const userContext = useAuthContext()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }
  useEffect(() => {
    if (userContext.emailVerified) {
      navigate('/')
    } else {
      const actionCodeSettings = {
        url: `http://localhost:8080/ConfirmEmailAddress`,
      }
      sendEmailVerification(userContext, actionCodeSettings)
    }
  }, [])

  const resend = async () => {
    try {
      if (userContext.emailVerified) {
        alert('既にメールは確認済みです')
      } else {
        alert('認証メールを再送しました')

        const actionCodeSettings = {
          url: `http://localhost:8080/ConfirmEmailAddress`,
        }
        sendEmailVerification(userContext, actionCodeSettings)
        navigate('/ConfirmEmailAddress')
      }
    } catch (err) {
      alert('認証メール送信に失敗しました。メールアドレスを確認して下さい')
    }
  }
  return (
    <div>
      <p>確認メールを送信しました。</p>
      <p>メールを確認して下さい</p>
      <div>
        <small>メールが送信されていない場合、再送ボタンを押して下さい。</small>
        <button onClick={resend}>再送</button>
      </div>
    </div>
  )
}
