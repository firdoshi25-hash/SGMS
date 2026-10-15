const express = require("express");
const { body } = require("express-validator");
const { currentUser, login, logout, register } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  body("name").trim().isLength({ min: 2, max: 80 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 8, max: 72 }),
  validateRequest,
  register,
);
router.post(
  "/login",
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validateRequest,
  login,
);
router.get("/me", requireAuth, currentUser);
router.post("/logout", logout);

module.exports = router;