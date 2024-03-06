import React, { useEffect, useRef, useState } from 'react'
import logo2 from "../../assets/synclab-logo-2.png";
import "./EditorPage.css"
import Client from '../../components/Client/Client';
import Editor from '../../components/Editor/Editor';
import {initSocket} from "../../socket"
import ACTIONS from '../../Actions';
import {Navigate, useLocation, useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast'
const EditorPage = () => {
  //usestate snippets
  const [clients, setClients] = useState([]);
  const dummyArray = [1,2,3,4,5,6,7,8,9,10];
  const navigate = useNavigate();
  const location = useLocation();
  const {roomId} = useParams();
  console.log(roomId);
  //socket code
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  useEffect(() => {
    const init  = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err) => handleErrors(err))
      socketRef.current.on('connect_failed',(err) => handleErrors(err))

      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed, try again later');
        navigate('/');
      }
      socketRef.current.emit(ACTIONS.JOIN,
      {
        roomId,
        username: location.state?.username,
      }
        );
        //listening for joined event
        socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId}) => {
          if(username !== location.state?.username){
            toast.success(`${username} joined the room`,{
              id: 'join-room',
            });
            console.log(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code: codeRef.current,
            socketId,
          });
        });

        //listeneing for disconnected

        socketRef.current.on(ACTIONS.DISCONNECTED,({username,socketId}) => {
          toast.success(`${username} left the room`,{
            id: 'left-room',
          });
          console.log(`${username} left the room`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId === socketId)
          });
        });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  //copy room id
  async function copyRoomIDFn (){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied to your clipboard',{
        id: 'copy-room',
      });
    }
    catch(err){
      toast.error('There was some issue while copying room ID');
      console.log(err);
    }
  }

  //leave room

  function leaveRoomFn(){
    navigate('/');
  }

  if(!location.state){
    return <Navigate to='/' />
  }

  return (
    <div className="editor-page-container">
      <div className="left-section">
        <div className="left-top-section">
          <div className="logo-container">
            <img src={logo2} alt="logo" className='logo-css-editor' />
          </div>
          <div className="connected-section">
            <div className='connected-user-text'>Connected Users:</div>
            <div className="connected-list grid">
              {
                clients && clients.map((data) => (
                  <>
                    <Client username={data.username} />
                  </>
                ))
              }
            </div>
          </div>
        </div>
        <div className="left-bottom-section">
          <button className='btn copy-btn' onClick={copyRoomIDFn}>Copy Room ID</button>
          <button className='btn leave-btn' onClick={leaveRoomFn}>Leave</button>
        </div>
      </div>
      <div className="right-section">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code;}} />
      </div>
    </div>
  )
}

export default EditorPage