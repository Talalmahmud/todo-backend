import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDb } from "./utils/db.js";

const app = express();
const port = process.env.PORT;

console.log(port);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
