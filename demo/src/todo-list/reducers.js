import { nanoid } from 'swagger-adjust';

import { addItem } from './actions';

export const initialState = {
  items: [],
};

const reducers = {
  [addItem]: (state, action) => {
    const items = state.items.slice();
    const id = nanoid();
    const newItem = { id, ...action.payload };

    items.unshift(newItem);

    return { ...state, items };
  },
};

export default reducers;
