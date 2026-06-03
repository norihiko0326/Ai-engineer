import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import type { TaskContextValue } from '../context/TaskContext';

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
