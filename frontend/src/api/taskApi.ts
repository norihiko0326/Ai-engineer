import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Task } from '../types/task';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const fetchAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/api/tasks');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
};

export const fetchTasksByStatus = async (status: string): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>(`/api/tasks/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch tasks with status ${status}:`, error);
    throw error;
  }
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await api.get<Task>(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch task ${id}:`, error);
    throw error;
  }
};

export const searchTasksByKeyword = async (keyword: string): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/api/tasks/search', {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to search tasks with keyword "${keyword}":`, error);
    throw error;
  }
};
