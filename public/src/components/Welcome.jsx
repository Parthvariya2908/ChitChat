import robot from "../assets/robot.gif";
import style from "./Welcome.module.css";
const Welcome = ({ currentUser }) => {
  return (
    <div className={style["container"]}>
      <img src={robot} alt="image" />
      <h1>
        Welcome <span>{currentUser ? currentUser["username"] : ""}</span>
      </h1>
      <h3>Please select the contact to start meassaging ! </h3>
    </div>
  );
};
export default Welcome;
