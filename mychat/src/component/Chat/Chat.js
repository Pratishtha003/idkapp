import React, { useEffect , useState} from 'react'
import {user1} from '../Join/Join'
import socketIo from "socket.io-client";
import "./Chat.css";
import Message from '../Message/Message';
import ReactScrollBottom from "react-scroll-to-bottom";


let socket;
const ENDPOINT = "http://localhost:4500";

const Chat = () => {

  const [id, setid] = useState("")
  const [message,setMessage]=useState([]);
  const send =()=>{
    const message = document.getElementById('chatInput').value;
    socket.emit('message',{message,id});  ///////////
    document.getElementById('chatInput').value="";
  }

  // socket = socketIo(ENDPOINT,{transports:['websocket']});

  useEffect(()=>{
    socket = socketIo(ENDPOINT,{transports:['websocket']});

    socket.on('connect',()=>{
      // alert('connection successfull');
      setid(socket.id);
    })
    console.log(socket);

    socket.emit('joined',{user1})   //emit means we are sending the user to the backend in index.js where socket.on is written & on means we sre recievning in backend

    socket.on('welcome',(data)=>{
      // setMessage([...message,data]);
      setMessage((message) => [...message, data]);
      console.log(data.user1,data.message);//recieving from backend
    })

    socket.on('userJoined',(data)=>{
      // setMessage([...message,data]);
      setMessage((message) => [...message, data]);
      console.log(data.user1,data.message);
    })

    socket.on('leave',(data)=>{
      // setMessage([...message,data]);
      setMessage((message) => [...message, data]);
      console.log(data.user1,data.message)
    })

    return()=>{
      socket.emit('disconnect1');
      socket.off();
    }
  },[]); //remove socket for 1 waning

  useEffect(()=>{
    socket.on('sendMessage',(data)=>{
      setMessage([...message,data]);
      console.log(data.user1,data.message,data.id);
    })
    return()=>{
      socket.off(); //aftern one message off the socket dont render again and again
    }
  },[message]);//

  // Inside the useEffect function, there is an event listener attached
  //to the connect event of a socket object. The socket.on method is typically
  //used in a WebSocket scenario to listen for specific events.When the 'connect'
  //event is triggered on the socket object, it will execute the callback function
  //that displays an alert saying 'connected'. This is a simple notification to inform
  //the user or developer that the socket connection has been established.
  //The dependency array [socket] indicates that this effect should only run
  //if the socket object changes. This is a common practice in React to prevent
  //unnecessary re-renders or repeated side effects when the dependencies haven't
  //changed.The return statement inside useEffect is used for cleanup.
  //In this case, an empty arrow function is returned. Cleanup functions are 
  //executed when the component unmounts or when the dependency array changes, 
  //effectively cleaning up any resources or subscriptions to prevent memory 
  //leaks.

  return (
    <div className='chatPage'>
      <div className='chatContainer'>
        <div className='header'>
          <h2>MyChat</h2>
          <a href='/'><img src="https://www.pngmart.com/files/13/Cross-Mark-PNG-Image.png" alt="close"></img></a>
        </div>
        <ReactScrollBottom className='chatBox'>
          {message.map((item,i)=><Message user1={item.id===id?'':item.user1} message={item.message} classs={item.id===id?'right1':'left1'}/>)} {/*item is a object which has user, message and id */}
        </ReactScrollBottom>
        <div className='inputBox'>
          <input onKeyPress={(event)=>event.key==='Enter'? send():null} type="text" id="chatInput"></input>
          <button onClick={send} className='sendBtn'>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat