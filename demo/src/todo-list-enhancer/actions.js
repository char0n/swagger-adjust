import { createAction } from 'swagger-adjust';

export const completeItem = createAction('todoList/completeItem');

export const uncompleteItem = createAction('todoList/uncompleteItem');

export const deleteItem = createAction('todoList/deleteItem');

export const completeAll = createAction('todoList/completeAll');

export const deleteAll = createAction('todoList/deleteAll');
