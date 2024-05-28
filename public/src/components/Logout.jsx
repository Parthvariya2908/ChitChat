import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styles from "./Logout.module.css";
const Logout = () => {
  const nevigate = useNavigate();
  const handleClike = async () => {
    localStorage.clear();
    nevigate("/");
  };
  return (
    <button className={styles["btn"]} onClick={handleClike}>
      <BiPowerOff />
    </button>
  );
};
export default Logout;
