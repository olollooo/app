import React from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const DisplayCheck = (props: Props) => {
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox onChange={(e) => props.onChange(e)} />}
          label="相手に名前を表示する"
        />
      </FormGroup>
    </>
  )
}
