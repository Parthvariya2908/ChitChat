const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenSecreate = "thisisfortoken";
const genreateToken = (username) => {
  const payload = { username: username };
  return jwt.sign(payload, tokenSecreate, { expiresIn: "1h" });
};
const register = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { username, password, email } = req.body;
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    if (usernameCheck) {
      return res
        .status(400)
        .json({ msg: "Uername is already used ! ", status: false });
    }
    if (emailCheck) {
      return res
        .status(400)
        .json({ msg: "Email is already used ! ", status: false });
    }
    hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    await user.save();

    const token = genreateToken(user.username);
    return res.status(200).json({ status: true, user, token });
  } catch (ex) {
    next(ex);
  }
};

const login = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { username, password } = req.body;
    const userCheak = await User.findOne({ username });
    if (userCheak) {
      const passwordcmp = await bcrypt.compare(password, userCheak.password);
      if (passwordcmp) {
        delete userCheak.password;
        const token = genreateToken(userCheak.username);
        return res.status(200).json({ status: true, user: userCheak, token });
      } else {
        return res
          .status(400)
          .json({ msg: "Wrong Password or Wrong Username ! ", status: false });
      }
    } else {
      return res
        .status(400)
        .json({ msg: "UserName Doesn't Exist ! ", status: false });
    }
  } catch (ex) {
    next(ex);
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const { image, token } = req.body;
    const id = req.params.id;
    const isLogedIn = jwt.verify(
      token,
      tokenSecreate,
      async (err, username) => {
        if (err) {
          res.status(400).json({ msg: "Plese Login First ", isSet: false });
        } else {
          const user = await User.findByIdAndUpdate(id, {
            avatarImage: image,
            isAvatarImageSet: true,
          });
          console.log(user);
          res.status(200).json({ user_details: user, isSet: true });
        }
      }
    );
  } catch (ex) {
    next(ex);
  }
};
const allfriends = (req, res, next) => {
  try {
    const { token } = req.body;
    jwt.verify(token, tokenSecreate, async (err, usernameob) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Login is Required ", isGet: false });
      }
      const users = await User.findById(req.params.id).populate("friends");
      // console.log(users);
      const { friends } = users;
      const newList = friends.map((friend) => {
        const { username, email, avatarImage, _id } = friend;
        return { username, email, avatarImage, _id };
      });
      // console.log(newList);
      return res.status(200).json({ friends: newList, isGet: true });
    });
  } catch (ex) {
    next(ex);
  }
};

const friend = (req, res, next) => {
  try {
    const { token, username } = req.body;
    jwt.verify(token, tokenSecreate, async (err, usernameob) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Login is Required ", isGet: false });
      }
      // console.log(username);
      const user = await User.findOne({ username: username });
      // console.log(user);
      return res.status(200).json({ user });
    });
  } catch (ex) {
    next(ex);
  }
};

const addfriend = (req, res, next) => {
  try {
    const { currentUser, searchResult, token } = req.body;
    jwt.verify(token, tokenSecreate, async (err, usernameob) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Login is Required ", isGet: false });
      }
      console.log(currentUser._id);
      console.log(searchResult.user._id);
      const user1 = await User.findById(currentUser._id);
      user1.friends.push(searchResult.user._id);
      await user1.save();
      const user2 = await User.findById(searchResult.user._id);
      user2.friends.push(currentUser._id);
      await user2.save();
      return res.status(200).json({ flag: "1" });
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = { register, login, setAvatar, allfriends, friend, addfriend };
