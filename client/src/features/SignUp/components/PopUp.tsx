import React from 'react'
import '../layout/PopUp.scss'

export const PopUpComponent = (props: any) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>
          x
        </span>
        {props.content}
      </div>
    </div>
  )
}
