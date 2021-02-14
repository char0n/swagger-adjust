import { nanoid } from 'swagger-adjust';

import { addItem } from './actions';

export const initialState = {
  items: [],
};

const reducers = {
  [addItem]: (state, action) => {
    const newItem = { id: nanoid(), ...action.payload };

    state.items.push(newItem);
  },
};

export default reducers;
