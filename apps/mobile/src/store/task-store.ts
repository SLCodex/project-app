import { create } from 'zustand';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '@project/shared';
import { api } from '../services/api';

type TaskState = {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await api.get<Task[]>('/tasks');
      set({ tasks: response.data, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (payload) => {
    const response = await api.post<Task>('/tasks', payload);
    set({ tasks: [response.data, ...get().tasks] });
  },

  updateTask: async (id, payload) => {
    const response = await api.put<Task>(`/tasks/${id}`, payload);
    set({ tasks: get().tasks.map((task) => (task.id === id ? response.data : task)) });
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set({ tasks: get().tasks.filter((task) => task.id !== id) });
  },
}));
