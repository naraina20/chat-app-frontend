import React, { useEffect, useState } from "react";
import { user } from "../Join/Join.js";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../image/send.png";
import Message from "../messages/Message.js";
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../image/closeIcon.png"


const ENDPOINT = "https://group-chat-naraina-app.herokuapp.com/";

let socket;

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setmessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  console.log(messages)

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setid(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });
    
    socket.on("leave", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message);
    });
    
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);
  
  useEffect(() => {
    socket.on("sendmessage", (data) => {
      setmessages([...messages, data])
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off()
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>GROUP CHAT</h2>
          <a href="/"><img src= {closeIcon} alt="close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => < Message user={item.id===id?"": item.user} message={item.message} classs={item.id===id?"right": "left"}/> )};
        </ReactScrollToBottom>

        <div className="inputBox">
          <input onKeyPress={(event)=> event.key === 'Enter'? send(): null} type="text" id="chatInput" />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
