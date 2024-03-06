import React, { useState } from 'react'
import "./Home.css"
import logo from "../../assets/synclab-logo.png";
import logo2 from "../../assets/synclab-logo-2.png";
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const Home = () => {
  //usestate values
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  //useNavigate to navigate
  const navigate = useNavigate();
  
  const handleClick = (event) => {
    //ripple handling
    handleRippleFn(event);
    //join cta handling
    joinRoomFn();
  };

  //create new room functionality 
  const createNewRoomFn = (e) => {
    e.preventDefault();
    const id = uuidV4();
    console.log(id);
    setRoomId(id);
    if(id !== ""){
      toast.success('Created a new room',{
        id: 'new-room',
      });
    }
    
  }

  const handleRippleFn = (event) => {
    //ripple effect code
    const button = event.currentTarget;
    const rippleDiv = document.createElement('div');
    const size = button.offsetWidth * 2;
    const pos = button.getBoundingClientRect();
    const x = event.clientX - pos.left - size / 2;
    const y = event.clientY - pos.top - size / 2;

    rippleDiv.classList.add('ripple-effect');
    rippleDiv.style.width = size + 'px';
    rippleDiv.style.height = size + 'px';
    rippleDiv.style.top = y + 'px';
    rippleDiv.style.left = x + 'px';
    button.appendChild(rippleDiv);

    setTimeout(() => {
      button.removeChild(rippleDiv);
    }, 400);
  }

  const joinRoomFn = () => {
        //routing and error handling 
        if(!roomId || !username){
          toast.error('Room ID and Username are required',{
            id: 'required',
          });
          return;
        }
        //if the values are inserted then redirect
        navigate(`/editor/${roomId}`,{
          state:{
            username,
          }}
        )
  }

  //handle enter key functionality
  const handleInputEnterFn = (e) => {
    if(e.code === 'Enter'){
      joinRoomFn();
    }
  }
  return (
    <div className="home-page-container">
        <div className="card-container">
            {/* <img src={logo} alt="logo" className='logo-css' /> */}
            <img src={logo2} alt="logo" className='logo-css' />
            <div className="form-container">
              <span className='invitation-label-css'>Paste Invitation Room <span className='invitation-label-id-css'>ID</span></span>
              <div className='input-group-css'>
                <input type="text" onKeyUp={handleInputEnterFn} value={roomId} onChange={(e) => {setRoomId(e.target.value)}} className='input-box-css' placeholder='Room ID' />
                <input type="text" onKeyUp={handleInputEnterFn}  value={username} onChange={(e) => {setUsername(e.target.value)}} className='input-box-css' placeholder='Username' />
                <button className='btn join-btn-css ripple' onClick={handleClick}>Join</button>
                <span className='invitation-label-css no-invite-css'>If you don't have a invite create <a href='' onClick={createNewRoomFn} className='create-new-text invitation-label-id-css'>new room</a></span>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Home