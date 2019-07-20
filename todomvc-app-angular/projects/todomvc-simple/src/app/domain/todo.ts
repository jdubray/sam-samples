export type Todo = {
  completed: boolean;
  editing: boolean;
  title: string;
  isDeleted?: boolean;
};

export function createTodo({
  title,
  completed = false,
  editing = false,
  isDeleted = false

}: Partial<Todo>): Todo {
  return {
    title,
    completed,
    editing,
    isDeleted
  };
}

export function isValidTodoTitle(title: string): boolean {
  return title && title.trim().length > 0;
}
