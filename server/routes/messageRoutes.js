const express = require("express");
const {
  AddMessage,
  getAllMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/addmsg", AddMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;
