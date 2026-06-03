import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { fetchAllTasks, fetchTasksByStatus, searchTasksByKeyword } from '../api/taskApi';
import axios from 'axios';

export interface TaskState {
  displayTasks: Task[];
  searchQuery: string;
  debouncedQuery: string;
  statusFilter: TaskStatus | 'all';
  loading: boolean;
  error: string | null;
}

export type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_DEBOUNCED_QUERY'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: TaskStatus | 'all' };

const initialState: TaskState = {
  displayTasks: [],
  searchQuery: '',
  debouncedQuery: '',
  statusFilter: 'all',
  loading: true,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, displayTasks: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_DEBOUNCED_QUERY':
      return { ...state, debouncedQuery: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload };
    default:
      return state;
  }
};

export interface TaskContextValue extends TaskState {
  filteredTasks: Task[];
  dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const useTaskContext = (): TaskContextValue => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Effect 1: デバウンス処理（searchQuery → debouncedQuery）
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_QUERY', payload: state.searchQuery });
    }, 400);
    return () => clearTimeout(timer);
  }, [state.searchQuery]);

  // Effect 2: API呼び出し（debouncedQuery と statusFilter 変化時）
  useEffect(() => {
    const controller = new AbortController();

    const loadTasks = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        let tasks: Task[];

        if (state.debouncedQuery.trim()) {
          // キーワード検索：バックエンド検索API
          tasks = await searchTasksByKeyword(state.debouncedQuery.trim());
          // 検索結果をステータスでクライアントフィルタ
          if (state.statusFilter !== 'all') {
            tasks = tasks.filter(t => t.status === state.statusFilter);
          }
        } else if (state.statusFilter !== 'all') {
          // キーワード無し、ステータスフィルター有り
          tasks = await fetchTasksByStatus(state.statusFilter);
        } else {
          // 両方なし：全件取得
          tasks = await fetchAllTasks();
        }

        dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (error) {
        if (axios.isCancel(error)) return;
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load tasks',
        });
      }
    };

    loadTasks();
    return () => controller.abort();
  }, [state.debouncedQuery, state.statusFilter]);

  const value: TaskContextValue = {
    ...state,
    filteredTasks: state.displayTasks,
    dispatch,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
