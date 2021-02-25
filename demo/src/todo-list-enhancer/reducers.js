import { nanoid } from 'swagger-adjust';

import { completeItem, uncompleteItem, deleteItem, completeAll, deleteAll } from './actions';

const reducers = {
  'todoList/addItem': (state, action) => {
    const newItem = { id: nanoid(), ...action.payload };

    state.items.unshift(newItem);
  },
  [completeItem]: (state, action) => {
    const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

    state.items[itemIndex].completed = true;
  },
  [uncompleteItem]: (state, action) => {
    const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

    state.items[itemIndex].completed = false;
  },
  [deleteItem]: (state, action) => {
    const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

    state.items.splice(itemIndex, 1);
  },
  [completeAll]: (state) => {
    state.items.map((item) => {
      item.completed = true;
      return item;
    });
  },
  [deleteAll]: (state) => {
    state.items = [];
  },
};

export default reducers;
