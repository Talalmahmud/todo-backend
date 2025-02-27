import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./utils/db.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT;

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", userRoute);

connectDb();
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
