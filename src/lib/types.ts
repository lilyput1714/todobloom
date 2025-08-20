export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
};
