require("dotenv").config();

const express = require("express");
const connectDB = require("./app/common/db/connection");
const authRoutes = require("./app/auth/auth.route");
const messageRoutes = require("./app/message/message.route");
const userRoutes = require("./app/user/user.route");
const errorHandler = require("./app/common/errors/appError");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Saraha API is running" });
});

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        const port = Number(process.env.PORT) || 3000;
        app.listen(port, () => console.log(`Saraha API is running on port ${port}`));
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

if (require.main === module) startServer();

module.exports = app;
