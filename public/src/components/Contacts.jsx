import styles from "./Contacts.module.css";
import Logo from "../assets/logo.svg";
import { useEffect, useState, useRef } from "react";
import { addfriendRoute, searchRoute } from "../utiles/apiRoutes";
import { IoAddOutline } from "react-icons/io5";
const Contactss = ({
  Allcontacts,
  currentUser,
  handleChatChange,
  setContacts,
}) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const SearchUsername = useRef("");
  const [searchResult, setSearchResult] = useState(undefined);
  const [searchIndex, setSearchIndex] = useState(undefined);
  const [cheakfriend, setCheakFriend] = useState(undefined);

  function hideButton(button) {
    button.style.display = "none";
  }

  // Function to show the button
  function showButton(button) {
    button.style.display = "block";
  }
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);
  const searchuser = async () => {
    const username = SearchUsername.current.value;
    console.log(username);
    if (!username) {
      console.log("empty");
      setCheakFriend(undefined);
      setSearchResult(undefined);
      return;
    }
    const token = await localStorage.getItem("token");
    fetch(searchRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, token }),
    })
      .then((data) => data.json())
      .then((dd) => {
        console.log(dd);
        if (dd.user !== null) {
          setSearchResult(dd);
        }
        // console.log(searchResult.user.avatarImage);
        // to cheak is friend or not
        if (dd) {
          var ct = Allcontacts.filter((ct, index) => {
            if (ct.username === dd.user.username) {
              setSearchIndex(index);
            }
            return ct.username == dd.user.username;
          });
          if (ct.length === 0) {
            setCheakFriend(undefined);
          } else {
            setCheakFriend(ct[0]);
          }
        }
        console.log(ct);
      });
  };
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    handleChatChange(contact);
  };
  const addfriend = async () => {
    const token = await localStorage.getItem("token");
    var button = document.getElementById("showhide");
    if (button.style.display !== "none") {
      hideButton(button);
    } else {
      showButton(button);
    }
    fetch(addfriendRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentUser, searchResult, token }),
    })
      .then((data) => data.json())
      .then((dd) => {
        Allcontacts = [...Allcontacts, searchResult.user];
        setContacts(Allcontacts);
      });
  };
  return (
    <>
      {currentUserName && currentUserImage && (
        <div className={styles["container"]}>
          <div className={styles["finduser"]}>
            <div className={styles["brand"]}>
              <img src={Logo} alt="logo" />
              <h3>snappy</h3>
            </div>
            <div className={styles["input-container"]}>
              <input type="texts" ref={SearchUsername}></input>
              <button
                onClick={() => {
                  searchuser();
                }}
              >
                Search
              </button>
            </div>
          </div>
          <div className={styles["contacts"]}>
            {SearchUsername.current.value && searchResult ? (
              cheakfriend ? (
                <div
                  className={`${styles["contact"]} ${
                    searchIndex === currentSelected ? styles["selected"] : ""
                  } `}
                  onClick={() => {
                    changeCurrentChat(searchIndex, searchResult.user);
                  }}
                >
                  <div className={styles["avatar"]}>
                    <img
                      src={`data:image/svg+xml;base64,${searchResult.user.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className={styles["username"]}>
                    <h3>{searchResult.user.username}</h3>
                  </div>
                </div>
              ) : (
                <div
                  className={styles["contact"]}
                  // onClick={() => {
                  //   changeCurrentChat(searchIndex, searchResult.user);
                  // }}
                >
                  <div className={styles["avatar"]}>
                    <img
                      src={`data:image/svg+xml;base64,${searchResult.user.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className={styles["username"]}>
                    <h3>{searchResult.user.username}</h3>
                  </div>
                  <div className={styles["addfriendOuter"]}>
                    <IoAddOutline
                      id="showhide"
                      className={styles["addfriend"]}
                      onClick={() => addfriend()}
                    />
                  </div>
                </div>
              )
            ) : (
              Allcontacts.map((contact, index) => (
                <div
                  className={`${styles["contact"]} ${
                    index === currentSelected ? styles["selected"] : ""
                  } `}
                  key={index}
                  onClick={() => {
                    changeCurrentChat(index, contact);
                  }}
                >
                  <div className={styles["avatar"]}>
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className={styles["username"]}>
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles["current-user"]}>
            <div className={styles["avatar"]}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className={styles["username"]}>
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Contactss;
