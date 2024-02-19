import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../../provider/AuthProvider/AuthProvider'
import { Button } from '@mui/material'
import { addFriend } from '../../../lib/Http/Http'
import { useMutation, useQueryClient } from 'react-query'
import { Toast } from '../../../public/Toast/Toast'

export const FriendRegistration = (props: {
  friendID: string
  userInformationID: string
  visible: boolean
}) => {
  const userContext = useAuthContext()
  const queryClient = useQueryClient()
  const { success } = Toast()

  if (userContext === null) {
    alert('正常にログインできていません。再度ログインして下さい')
    return <Navigate to="/login" />
  }

  const mutation = useMutation(addFriend, {
    onSuccess: () => {
      success('フレンドを追加しました')
      queryClient.invalidateQueries(['getfriendslist'])
    },
    onError: (e: any) => {
      alert(e.response.data)
    },
  })

  const relatedFriends: RelatedFriends = {
    friendship_user_id: props.userInformationID,
    friendship_friend_id: props.friendID,
  }

  const addFriendHander = () => {
    mutation.mutate(relatedFriends)
  }

  return (
    <Button
      variant="text"
      style={{ visibility: props.visible ? 'visible' : 'hidden' }}
      onClick={addFriendHander}
    >
      追加
    </Button>
  )
}
