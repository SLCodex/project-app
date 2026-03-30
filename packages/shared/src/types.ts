export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
};

export type CreateTaskPayload = {
  title: string;
};

export type UpdateTaskPayload = {
  title?: string;
  completed?: boolean;
};
