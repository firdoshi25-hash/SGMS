const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { dashboard } = require("./controllers/dashboardController");
const { createStudentAccount, listLeaveRequests, reviewLeaveRequest } = require("./controllers/adminController");
const { listUsers, updateProfile } = require("./controllers/userController");
const { requireAuth, requireRole } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const createResourceRouter = require("./routes/resourceRoutes");
const resources = require("./models/resources");

function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
  app.use("/api/auth", authRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  app.get("/api/dashboard", requireAuth, dashboard);
  app.get("/api/reports", requireAuth, dashboard);
  app.get("/api/users/me", requireAuth, (req, res) => res.json({ user: {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    settings: req.user.settings,
  } }));
  app.patch("/api/users/me", requireAuth, updateProfile);
  app.get("/api/admin/users", requireAuth, requireRole("admin"), listUsers);
  app.post("/api/admin/users", requireAuth, requireRole("admin"), createStudentAccount);
  app.get("/api/admin/leave", requireAuth, requireRole("admin"), listLeaveRequests);
  app.patch("/api/admin/leave/:id", requireAuth, requireRole("admin"), reviewLeaveRequest);

  for (const [path, Model] of Object.entries(resources)) {
    app.use(`/api/${path}`, requireAuth, createResourceRouter(Model));
  }

  app.use((_req, res) => {
    res.status(404).json({ message: "API route not found" });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;