const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Add it to backend/.env.");
  }

  return jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    walletBalance: user.walletBalance,
    holdings: user.holdings,
  };
}

async function signup(req, res) {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (name.trim().length < 2 || password.length < 8) {
    return res.status(400).json({
      message: "Use a name with at least 2 characters and a password with at least 8.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return res.status(201).json({
    token: createToken(user._id),
    user: publicUser(user),
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Email or password is incorrect." });
  }

  return res.json({ token: createToken(user._id), user: publicUser(user) });
}

async function getMe(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found." });
  return res.json({ user: publicUser(user) });
}

module.exports = { signup, login, getMe };
