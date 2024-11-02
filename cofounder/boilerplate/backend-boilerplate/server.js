import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { PGlite } from "@electric-sql/pglite";
dotenv.config();

const app = express();
const port = process.env.PORT || 1337;
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const dbPath = `./db`;

if (!fs.existsSync(dbPath)) {
  const postgres = new PGlite(dbPath);
  const dbInitCommands = fs
    .readFileSync(`./db.sql`, "utf-8")
    .toString()
    .split(/(?=CREATE TABLE |INSERT INTO)/);
  for (let cmd of dbInitCommands) {
    console.dir({ "backend:db:init:command": cmd });
    try {
      await postgres.exec(cmd);
    } catch (e) {
      console.dir({ "backend:db:init:error": e });
    }
  }
}

app.get("/", (req, res) => {
  res.json({ message: "cofounder backend boilerplate :)" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
