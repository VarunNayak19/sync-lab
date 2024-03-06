import React from 'react'
import Avatar from 'react-avatar'
import './Client.css'
const Client = ({username}) => {
  return (
    <div className="connected-user">
    {/* <div className="user-avatar-box">{data.username[0]}</div> */}
    <Avatar name={username} size='50' round="14px" />
    <div className='user-name-css'>{username}</div>
  </div>
  )
}

export default Client