import { completeItem, uncompleteItem, deleteItem, completeAll, deleteAll } from './actions';

const reducers = {
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
