const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith("replace-")) {
    throw new Error("JWT_SECRET must be a random secret of at least 32 characters");
  }

  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

function setAuthCookie(res, token) {
  res.cookie("sgms_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.JWT_COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, settings: user.settings };
}

async function register(req, res, next) {
  try {
    const email = req.body.email.toLowerCase();
    const existing = await User.exists({ email });

    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name: req.body.name, email, password: req.body.password });
    setAuthCookie(res, createToken(user));
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    const matches = user && await user.comparePassword(req.body.password);

    if (!matches) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    setAuthCookie(res, createToken(user));
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

function currentUser(req, res) {
  res.json({ user: publicUser(req.user) });
}

function logout(_req, res) {
  res.clearCookie("sgms_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(204).end();
}

module.exports = { register, login, currentUser, logout, publicUser };