import { createSelector } from 'swagger-adjust';

export const selectTodoList = (state) => state;

export const selectTodoListItems = createSelector(selectTodoList, (state) => state.items);
