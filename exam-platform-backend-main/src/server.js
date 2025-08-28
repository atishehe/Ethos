import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import competitionStageRoutes from "./routes/competitionStages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// Manual OPTIONS handler for preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,x-requested-with"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/competitionStages", competitionStageRoutes);

// Start server after DB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};
startServer();
