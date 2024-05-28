const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");
const app = express();

require("dotenv").config(); // THIS IS FOR ENVIRONMENT VARIABLE --> user process.env.---
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

//CONNECTING TO DATABASE
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("CONNECTED TO DB");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
const server = app.listen(process.env.PORT, () => {
  console.log("LISTENNIG TO THE SERVER ON PORT : ", process.env.PORT);
});

const io = socket(server, {
  cors: {
    origin: process.env.SOKET_URL,
    Credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatsocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
