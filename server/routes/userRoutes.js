const express = require("express");
const {
  register,
  login,
  setAvatar,
  allfriends,
  friend,
  addfriend,
} = require("../controllers/usersController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);
router.post("/allfriends/:id", allfriends);
router.post("/friend", friend);
router.post("/addfriend", addfriend);
module.exports = router;
