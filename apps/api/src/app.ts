import express, { type Express, type Request, type Response } from "express";

import taskRouter from "./controllers/task.js";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/tasks", taskRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
