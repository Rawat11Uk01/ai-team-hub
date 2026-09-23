import { Router } from "express";
import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { CreateTaskSchema, Task, UpdateTaskSchema } from "../types/task";

const taskRouter = Router();

const tasks = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/tasks.json"), "utf8"),
);

taskRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    data: tasks,
    message: "Tasks successfully fetched",
  });
});

taskRouter.post("/", (req: Request, res: Response) => {
  const validatedData = CreateTaskSchema.safeParse(req.body);

  if (!validatedData.success) {
    const errorMsg = validatedData.error?.issues[0]?.message;
    return res.status(400).json({
      error: "Bad Request",
      message: errorMsg ? errorMsg : "Please send correct data",
    });
  }

  const dataToAdd = {
    id: crypto.randomUUID(),
    ...validatedData.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  fs.writeFileSync(
    path.join(__dirname, "../data/tasks.json"),
    JSON.stringify([...tasks, dataToAdd], null, 2),
  );

  return res.status(201).json({
    data: dataToAdd,
    message: "Task successfully added",
  });
});

taskRouter.patch("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const validateData = UpdateTaskSchema.partial().strict().safeParse(data);

  if (!validateData.success) {
    const errorMsg = validateData.error.issues[0]?.message;
    return res.status(400).json({
      error: "Bad Request",
      message: errorMsg || "Please send correct data to update",
    });
  }

  const updateTask = tasks.find((t: Task) => t.id == id);

  if (!updateTask) {
    return res.status(404).json({
      error: "404 error",
      message: `No task with id: ${id} found`,
    });
  }

  const updateTaskIndex = tasks.indexOf(updateTask);

  const updateData = { ...updateTask, ...data, updatedAt: new Date() };

  tasks[updateTaskIndex] = updateData;

  fs.writeFileSync(
    path.join(__dirname, "../data/tasks.json"),
    JSON.stringify(tasks, null, 2),
  );
  return res.status(200).json({
    data: updateData,
    message: "Task successfully updated",
  });
});

taskRouter.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const taskToDelete = tasks.find((task: Task) => task.id == id);
  if (!taskToDelete) {
    return res.status(404).json({
      error: "404 error",
      message: `No task with id: ${id} found`,
    });
  }

  const data = tasks.filter((task: Task) => task.id !== id);

  fs.writeFileSync(
    path.join(__dirname, "../data/tasks.json"),
    JSON.stringify(data, null, 2),
  );

  res.status(204).json({
    message: "Task successfully deleted",
  });
});

export default taskRouter;
