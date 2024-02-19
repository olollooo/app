import React from 'react'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import { Box, IconButton } from '@mui/material'
import { useMutation } from 'react-query'
import { Toast } from '../../../public/Toast/Toast'
import { deleteFriend } from '../../../lib/Http/Http'

export const DeleteFriend = (props: { userID: string; friendID: string }) => {
  const { success } = Toast()

  const mutation = useMutation(deleteFriend, {
    onSuccess: () => {
      success('フレンドを削除しました')
    },
    onError: (e: any) => {
      alert(e.response.data)
    },
  })

  const deleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const confirm = window.confirm(
      'フレンドを削除します。\n削除した場合、相手のフレンドからも削除されます'
    )

    if (!confirm) {
      return
    }

    const deleteFriend: DeleteFriend = {
      friendship_user_id: props.userID,
      friendship_friend_id: e.currentTarget.value,
    }
    mutation.mutate(deleteFriend)
  }

  return (
    <Box
      component="span"
      sx={{
        pl: 3,
      }}
    >
      <IconButton
        edge="end"
        value={props.friendID}
        onClick={(e) => deleteClick(e)}
      >
        <HighlightOffRoundedIcon />
      </IconButton>
    </Box>
  )
}
