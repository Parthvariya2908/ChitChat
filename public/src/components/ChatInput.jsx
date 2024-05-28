import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useState } from "react";
import styles from "./ChatInput.module.css";
const ChatInput = ({ handleSendMsg }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setmsg] = useState("");

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (event, emojiObject) => {
    var message = msg;
    message += event.emoji;
    setmsg(message);
  };
  const myInlineStyles = {
    height: "350px",
  };
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setmsg("");
    }
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["butten-container"]}>
        <div className={styles["emoji"]}>
          <BsEmojiSmileFill onClick={handleEmojiPicker} />
          {showEmojiPicker && (
            <Picker
              className={styles["emoji-picker-react"]}
              style={myInlineStyles}
              onEmojiClick={onEmojiClick}
            />
          )}
        </div>
      </div>
      <form className={styles["input-container"]} onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Enter Your Text Here ! "
          value={msg}
          onChange={(e) => {
            setmsg(e.target.value);
          }}
        />
        <button className={styles["submit"]}>
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};
export default ChatInput;
