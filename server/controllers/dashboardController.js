const resources = require("../models/resources");

async function dashboard(req, res, next) {
  try {
    const owner = req.user.id;
    const [goals, tasks, sessions, attendance, projects, notifications] = await Promise.all([
      resources.goals.find({ owner }).lean(),
      resources.tasks.find({ owner }).lean(),
      resources["study-sessions"].find({ owner }).lean(),
      resources.attendance.find({ owner }).lean(),
      resources.projects.find({ owner }).lean(),
      resources.notifications.find({ owner, read: false }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const presentDays = attendance.filter((record) => ["present", "late"].includes(record.status)).length;
    const attendanceRate = attendance.length
      ? Math.round((presentDays / attendance.length) * 100)
      : 0;

    const recent = [
      ...goals.map((item) => ({ ...item, kind: "goal" })),
      ...tasks.map((item) => ({ ...item, kind: "task" })),
      ...sessions.map((item) => ({ ...item, kind: "study-session" })),
      ...projects.map((item) => ({ ...item, kind: "project" })),
    ].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 8);

    res.json({
      stats: {
        attendanceRate,
        attendanceDays: attendance.length,
        completedGoals: goals.filter((item) => item.status === "completed").length,
        totalGoals: goals.length,
        completedTasks: tasks.filter((item) => item.status === "completed").length,
        totalTasks: tasks.length,
        totalSessions: sessions.length,
        studyMinutes: sessions.reduce((total, item) => total + item.durationMinutes, 0),
        activeProjects: projects.filter((item) => item.status !== "completed").length,
      },
      recent,
      notifications,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { dashboard };