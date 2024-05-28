import styles from "./Chat.module.css";
import { allFriendsRoute, host } from "../utiles/apiRoutes";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Contactss from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
const Chat = () => {
  const socket = useRef();
  const [Allcontacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const nevigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      nevigate("/");
    } else {
      const user = JSON.parse(localStorage.getItem("user-deatils"));
      setCurrentUser(user);
      if (!user.isAvatarImageSet) {
        nevigate("/setAvatar");
      }
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem("token");
      const payload = {
        token: token,
      };
      const { _id } = currentUser;
      fetch(`${allFriendsRoute}/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((data) => data.json())
        .then((dd) => {
          if (dd.isGet) {
            setContacts(dd.friends);
          } else {
            nevigate("/");
          }
        });
    }
  }, [currentUser]);
  const handleChatChange = (Chat) => {
    setCurrentChat(Chat);
  };
  return (
    <>
      <div className={styles["outer"]}>
        <div className={styles["container"]}>
          <Contactss
            Allcontacts={Allcontacts}
            currentUser={currentUser}
            handleChatChange={handleChatChange}
            setContacts={setContacts}
          ></Contactss>
          {!isLoading && currentChat ? (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          ) : (
            <Welcome currentUser={currentUser} />
          )}
        </div>
      </div>
    </>
  );
};
export default Chat;
