require("dotenv").config();

const createApp = require("./app");
const connectDB = require("./config/db");

async function startServer() {
  try {
    await connectDB();
    const port = Number(process.env.PORT) || 5000;
    const app = createApp();

    app.listen(port, () => {
      console.log(`SGMS API listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };