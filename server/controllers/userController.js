const User = require("../models/User");
const { publicUser } = require("./authController");

async function updateProfile(req, res, next) {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (name.length < 2 || name.length > 80) {
        return res.status(400).json({ message: "Name must be between 2 and 80 characters" });
      }
      req.user.name = name;
    }

    if (body.settings && typeof body.settings === "object") {
      if (["light", "dark"].includes(body.settings.theme)) {
        req.user.settings.theme = body.settings.theme;
      }
      if (typeof body.settings.emailNotifications === "boolean") {
        req.user.settings.emailNotifications = body.settings.emailNotifications;
      }
    }

    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(500);
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateProfile, listUsers };