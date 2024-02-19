import React from 'react'
import { TextField } from '@mui/material'
import { Props } from '../types/types'

export const CommonTextField = (props: Props) => {
  return (
    <TextField
      type="text"
      label={props.label}
      variant="standard"
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => props.onChange(e)}
    />
  )
}
