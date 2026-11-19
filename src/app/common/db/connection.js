const mongoose = require("mongoose");

const connectDB = async () => {
    const { MONGO_URI, DB_NAME } = process.env;
    if (!MONGO_URI) throw new Error("MONGO_URI is missing from environment variables");

    await mongoose.connect(MONGO_URI, DB_NAME ? { dbName: DB_NAME } : {});
    console.log(`MongoDB connected${DB_NAME ? ` to ${DB_NAME}` : ""}`);
};

module.exports = connectDB;
