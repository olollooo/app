import { ChangeEvent } from "react"

export type Props = {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  label: string
  placeholder: string
}