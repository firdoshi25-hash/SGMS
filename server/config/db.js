const mongoose = require("mongoose");

async function connectDB() {
	const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

	if (!mongoUri) {
		throw new Error("MONGO_URI (or MONGODB_URI) is required. Configure a MongoDB connection in server/.env.");
	}
	if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith("replace-")) {
		throw new Error("JWT_SECRET must be a real random secret of at least 32 characters in server/.env.");
	}

	await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
	console.log("MongoDB connected");
}

module.exports = connectDB;
