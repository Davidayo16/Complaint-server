const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(
    `Incoming request: ${req.method} ${req.url} at ${new Date().toISOString()}`
  );
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/", (req, res) => {
  console.log("Health check hit at", new Date().toISOString());
  res.send("Complaint Management API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
