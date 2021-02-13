import { assocPath, reject, propEq, map, assoc } from 'ramda';

import { completeItem, uncompleteItem, deleteItem, completeAll, deleteAll } from './actions';

const reducers = {
  [completeItem]: (state, action) => {
    const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

    return assocPath(['items', itemIndex, 'completed'], true, state);
  },
  [uncompleteItem]: (state, action) => {
    const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

    return assocPath(['items', itemIndex, 'completed'], false, state);
  },
  [deleteItem]: (state, action) => {
    const items = reject(propEq('id', action.payload.id), state.items);
    return { ...state, items };
  },
  [completeAll]: (state) => {
    const items = map(assoc('completed', true), state.items);
    return { ...state, items };
  },
  [deleteAll]: (state) => {
    return { ...state, items: [] };
  },
};

export default reducers;
