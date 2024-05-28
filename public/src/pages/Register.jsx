import { useState, useEffect } from "react";
import styles from "./Register.module.css";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utiles/apiRoutes";
const Register = () => {
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
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password, confirmPassword } = value;
      fetch(registerRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.status === false) {
            toast.error(data.msg, toastOptions);
          }
          if (data.status === true) {
            console.log(data);
            localStorage.setItem("user-deatils", JSON.stringify(data.user));
            console.log("iakfjdlfljsd");
            localStorage.setItem("token", data.token);
            nevigate("/setAvatar");
          }
        });
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = value;
    if (password.length < 8) {
      toast.error(
        "Password should be greater than or eqale to 8 charactors",
        toastOptions
      );
      return false;
    } else if (password != confirmPassword) {
      toast.error(
        "Password and confirm password should be same ",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be greater 3 charactors ", toastOptions);
      return false;
    } else if (email.length < 14) {
      toast.error(
        "Email should be greater than or equal to 5 charactores",
        toastOptions
      );
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
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default Register;
