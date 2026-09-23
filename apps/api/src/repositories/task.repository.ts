import type { Task, CreateTask, UpdateTask } from "../types/task.js";

export interface TaskRepository {
  create(data: CreateTask): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, data: UpdateTask): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
