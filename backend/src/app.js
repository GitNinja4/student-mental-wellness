import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth_routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Mental Wellness Tracker API is running"
    });
});

app.use("/api/auth", authRoutes);

export default app;