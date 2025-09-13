import express from "express";
import cors from "cors";
import "@dotenvx/dotenvx/config";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
const app = express();
const PORT = process.env.PORT || "3023";
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  credentials: true
}));

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/mern/notes", notesRoutes);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
