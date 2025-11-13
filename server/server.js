import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

const app = express();
await connectDB();
// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello World!,nouman");
});

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
