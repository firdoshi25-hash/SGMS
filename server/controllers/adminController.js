const resources = require("../models/resources");

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

module.exports = { listLeaveRequests, reviewLeaveRequest };