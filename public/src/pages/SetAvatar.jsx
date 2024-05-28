import { useState, useEffect } from "react";
import styles from "./SetAvatar.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utiles/apiRoutes";
import loader from "../assets/loader.gif";
import { Buffer } from "buffer";
import axios from "axios";
const SetAvatar = () => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const api = "http://api.multiavatar.com";
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const nevigate = useNavigate();
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Profile Pic must be selected ! ", toastOptions);
    } else {
      const token = await localStorage.getItem("token");
      const user = await JSON.parse(localStorage.getItem("user-deatils"));
      const payload = {
        token: token,
        image: avatars[selectedAvatar],
      };
      fetch(`${setAvatarRoute}/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((data) => data.json())
        .then((tt) => {
          const { isSet, user_details } = tt;
          if (isSet) {
            user_details.avatarImage = avatars[selectedAvatar];
            user_details.isAvatarImageSet = true;
            localStorage.setItem(
              "user-deatils",
              JSON.stringify(tt.user_details)
            );
            nevigate("/chat");
          } else {
            toast.error(
              "Error in setting Avatar Please try again ",
              toastOptions
            );
          }
        });
    }
  };
  useEffect(() => {
    const setProfilePic = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.floor(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setLoading(false);
    };
    setProfilePic();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className={styles["loader"]}>
          <img
            className={styles["imgg"]}
            src="https://cdn.dribbble.com/users/2882885/screenshots/7861928/media/a4c4da396c3da907e7ed9dd0b55e5031.gif"
          />
        </div>
      ) : (
        <div className={styles["container"]}>
          <div className={styles["title"]}>
            <h1>Pick avatar as your profile picture </h1>
          </div>
          <div className={styles["avatars"]}>
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`${styles["avatar"]}  ${
                    selectedAvatar === index ? styles["selected"] : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => {
                      setSelectedAvatar(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <ToastContainer />
          <button
            type="submit"
            className={styles["submit-btn"]}
            onClick={setProfilePicture}
          >
            Set as Profile Pic
          </button>
        </div>
      )}
    </>
  );
};
export default SetAvatar;
