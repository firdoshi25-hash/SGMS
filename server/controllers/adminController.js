const User = require("../models/User");
const resources = require("../models/resources");
const { publicUser } = require("./authController");

async function createStudentAccount(req, res, next) {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || name.length < 2 || name.length > 80) {
      return res.status(400).json({ message: "Student name must be between 2 and 80 characters" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "A valid student email is required" });
    }
    if (!password || password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: "Student password must be between 8 and 72 characters" });
    }

    const existing = await User.exists({ email });
    if (existing) {
      return res.status(409).json({ message: "A student with that email already exists" });
    }

    const student = await User.create({ name, email, password, role: "student" });
    res.status(201).json({ user: publicUser(student), message: "Student account created successfully" });
  } catch (error) {
    next(error);
  }
}

async function listLeaveRequests(_req, res, next) {
  try {
    const items = await resources.leave.find().populate("owner", "name email").sort({ createdAt: -1 }).limit(500);
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function reviewLeaveRequest(req, res, next) {
  const { status } = req.body || {};
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be approved or rejected" });
  }

  try {
    const item = await resources.leave.findByIdAndUpdate(
      req.params.id,
      { $set: { status, reviewedBy: req.user.id, reviewedAt: new Date() } },
      { new: true, runValidators: true },
    ).populate("owner", "name email");

    if (!item) return res.status(404).json({ message: "Leave request not found" });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

module.exports = { createStudentAccount, listLeaveRequests, reviewLeaveRequest };