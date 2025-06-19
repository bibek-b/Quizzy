import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to register!" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(409).json({ error: "User haven't registered yet!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(409).json({ error: "Password is incorrect!" });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    res.cookie("token", token, {
      // httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3 days in millisecond
    })

    return res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to login!" });
  }
};
