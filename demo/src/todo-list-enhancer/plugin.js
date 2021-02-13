import React from 'react';
import { assocPath } from 'ramda';
import { useSystemComponent } from 'swagger-adjust';

import { completeItem, uncompleteItem, deleteItem, completeAll, deleteAll } from './actions';
import { formatTimestamp } from './fn';
import reducers from './reducers';
import TodoList from './wraping-components/TodoList';
import TodoListItem from './components/TodoListItem';
import TodoListBatchOperations from './components/TodoListBatchOperations';

const TodoListEnhancerPlugin = (system) => {
  const todoListFn = assocPath(['formatTimestamp'], formatTimestamp, system.fn.todoList);

  return {
    components: {
      TodoListItem,
      TodoListBatchOperations,
    },
    wrapComponents: {
      TodoList,
    },
    fn: {
      todoList: todoListFn,
    },
    statePlugins: {
      todoList: {
        actions: {
          completeItem,
          uncompleteItem,
          deleteItem,
          completeAll,
          deleteAll,
        },
        wrapActions: {
          addItem: (oriAction) => (payload) => {
            oriAction({ ...payload, completed: false, createdAt: Date.now() });
          },
        },
        reducers,
      },
    },
  };
};

export default TodoListEnhancerPlugin;
