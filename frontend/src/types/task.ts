export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: number;
  dueDate?: string | null;
  createdBy?: string;
  updatedBy?: string | null;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
