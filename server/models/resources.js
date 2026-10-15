const mongoose = require("mongoose");

const owner = { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true };

const definitions = {
  goals: {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    target: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, default: "Study", maxlength: 40 },
    description: { type: String, default: "", maxlength: 2000 },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    dueDate: Date,
  },
  tasks: {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 2000 },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    dueDate: Date,
  },
  "study-sessions": {
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    topic: { type: String, required: true, trim: true, maxlength: 160 },
    durationMinutes: { type: Number, required: true, min: 1, max: 1440 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    studiedAt: { type: Date, default: Date.now },
  },
  attendance: {
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "late", "excused"], required: true },
    note: { type: String, default: "", maxlength: 1000 },
  },
  notes: {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, default: "", maxlength: 20000 },
    tags: { type: [String], default: [] },
    resourceUrl: { type: String, default: "", maxlength: 2000 },
  },
  projects: {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 4000 },
    status: { type: String, enum: ["planned", "in-progress", "completed"], default: "planned" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: Date,
  },
  leave: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  notifications: {
    title: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
};

const resources = Object.fromEntries(
  Object.entries(definitions).map(([key, fields]) => {
    const modelName = key.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
    const schema = new mongoose.Schema({ ...fields, owner }, { timestamps: true });

    if (key === "attendance") {
      schema.index({ owner: 1, date: 1 }, { unique: true });
    }
    if (key === "leave") {
      schema.pre("validate", function validateLeaveDates() {
        if (this.startDate && this.endDate && this.endDate < this.startDate) {
          this.invalidate("endDate", "End date must be on or after the start date");
        }
      });
    }

    return [key, mongoose.models[modelName] || mongoose.model(modelName, schema)];
  }),
);

module.exports = resources;