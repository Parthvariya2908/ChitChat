import { useState, useEffect } from "react";
import styles from "./Register.module.css";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utiles/apiRoutes";
const Login = () => {
  const nevigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [value, setValue] = useState({
    username: "",
    password: "",
  });
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     nevigate("/");
  //   }
  // }, []);
  const handleChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = value;
      fetch(loginRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.status === false) {
            toast.error(data.msg, toastOptions);
          }
          if (data.status === true) {
            localStorage.setItem("user-deatils", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            nevigate("/chat");
          }
        });
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = value;
    if (password === "") {
      toast.error("Password should't be empty !", toastOptions);
      return false;
    } else if (username === "") {
      toast.error("Username should't be empty", toastOptions);
      return false;
    }
    return true;
  };
  return (
    <>
      <div className={styles["container"]}>
        <form method="post" onSubmit={(e) => handleSubmit(e)}>
          <div className={styles["brand"]}>
            <img src={Logo} alt="Logo" />
            <h1>ChitChat</h1>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            min={3}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};
export default Login;
