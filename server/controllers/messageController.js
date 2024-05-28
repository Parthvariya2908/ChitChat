const messages = require("../models/messageModel");

const AddMessage = async (req, res, next) => {
  try {
    const { msg, from, to } = req.body;
    const data = new messages({
      message: { text: msg },
      users: [from, to],
      sender: from,
    });
    await data.save();
    if (data) {
      res.status(200).json({ msg: "message succefully add !" });
    } else {
      res.status(400).json({ msg: "failed to add message ! " });
    }
  } catch (ex) {
    next(ex);
  }
};

const getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    // console.log(from, to);
    const allmsg = await messages
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    // console.log("allmgg", allmsg);
    const projectMessages = allmsg.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    // console.log(projectMessages);
    res.status(200).json({ messageObj: projectMessages });
  } catch (ex) {
    next(ex);
  }
};

module.exports = { AddMessage, getAllMessage };
