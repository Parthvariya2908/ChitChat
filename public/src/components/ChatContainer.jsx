import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { getALLMessageRoute, sendMessageRoute } from "../utiles/apiRoutes";
import styles from "./ChatContainer.module.css";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [allmsg, setmessages] = useState([]);
  const [rend, setrend] = useState(true);
  const chatContainerRef = useRef(null);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  // for directly scorll down the chat
  useLayoutEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [allmsg]);

  //Load messages
  useEffect(() => {
    if (currentChat) {
      fetch(getALLMessageRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: currentUser._id, to: currentChat._id }),
      })
        .then((data) => data.json())
        .then((dd) => {
          setmessages(dd.messageObj);
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        });
    }
  }, [rend, currentChat]);

  //Send messages
  const handleSendMsg = async (msg) => {
    fetch(sendMessageRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg: msg,
        from: currentUser._id,
        to: currentChat._id,
      }),
    });
    setrend(!rend);
    setmessages([...allmsg, { fromSelf: true, message: msg }]);
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg: msg,
    });
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMsg({ fromSelf: false, message: msg });
      });
    }
  }, []);
  useEffect(() => {
    arrivalMsg && setrend(!rend);
    setArrivalMsg(null);
  }, [arrivalMsg]);
  return (
    <>
      {currentChat && (
        <div className={styles["container"]}>
          <div className={styles["chat-header"]}>
            <div className={styles["user-details"]}>
              <div className={styles["avatar"]}>
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className={styles["username"]}>
                <h2>{currentChat.username}</h2>
              </div>
            </div>
            <Logout></Logout>
          </div>
          <div ref={chatContainerRef} className={styles["chat-messages"]}>
            {allmsg.map((msg, index) => (
              <div key={index}>
                <div
                  className={` ${styles["message"]} ${
                    msg.fromSelf ? styles["sended"] : styles["recieved"]
                  }  `}
                >
                  <div className={styles["content"]}>
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
};
export default ChatContainer;
