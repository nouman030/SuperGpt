//api to register user
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ Success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    res.json({
      Success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

//api to login user

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ Success: false, message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ Success: false, message: "Invalid Password" });
    }
    const token = generateToken(user._id);
    res.json({
      Success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

//Api to get user

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ Success: true, user });
  } catch (error) {
    return res.status(500).json({ Success: false, message: error.message });
  }
};
