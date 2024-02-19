import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { SignUp } from '../features/SignUp/SignUp'
import { MailAddressChk } from '../features/SignUp/components/MailAddressChk'
import { Home } from '../features/Home/root/Home'
import { Login } from '../features/Login/root/Login'
import { PrivacyPolicy } from '@/features/PrivacyPolicy/PrivacyPolicy'
import { TermsOfService } from '@/features/TermsOfService/TermsOfService'
import { Settings } from '../features/Settings/root/Settings'
import { ConfirmEmailAddress } from '../features/Settings/components/ConfirmEmailAddress'
import { Contact } from '../features/Contact/root/Contact'
import { StartOfQuestion } from '@/features/StartOfQuestion/root/StartOfQuestion'
import { Question } from '@/features/Question/root/Question'
import { Result } from '@/features/Result/root/Result'

export const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/privacypolicy'} element={<PrivacyPolicy />} />
          <Route path={'/termsofservice'} element={<TermsOfService />} />
          <Route path={'/mailaddresschk'} element={<MailAddressChk />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/settings'} element={<Settings />} />
          <Route
            path={'/mailaddresschksetting'}
            element={<ConfirmEmailAddress />}
          />
          <Route path={'/contact'} element={<Contact />} />
          <Route path={'/startofquestion'} element={<StartOfQuestion />} />
          <Route path={'/question'} element={<Question />} />
          <Route path={'/result'} element={<Result />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
