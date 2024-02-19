import React from 'react'
import { ChangeEmailAddress } from '../components/ChangeEmailAddress'
import { ChangePassword } from '../components/ChangePassword'
export const Settings = () => {
  return (
    <>
      <div>
        <ChangeEmailAddress />
      </div>
      <div>
        <ChangePassword />
      </div>
    </>
  )
}
