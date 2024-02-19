import React, { ChangeEvent } from 'react'
import { TextareaAutosize } from '@mui/material'

type Props = {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const InquiryDetails = (props: Props) => {
  return (
    <TextareaAutosize
      value={props.value}
      onChange={(e) => props.onChange(e)}
      maxRows={4}
    />
  )
}
