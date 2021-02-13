import { createAction } from 'swagger-adjust';

export const addItem = createAction('todoList/addItem', (title) => ({
  payload: { title },
}));
