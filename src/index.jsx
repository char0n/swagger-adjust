import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import reportWebVitals from './reportWebVitals';
import System from './system';
import SystemContext from './system/context';

const StatePlugin = (system) => {
  const updateAction = system.createAction('example/updateAction');

  return {
    components: {
      TestComponent: () => {
        console.dir(system.getSystem().plugin2Selectors.selectAggregate());

        return (
          <div>
            <h2>System API:</h2>
            <div>System</div>
          </div>
        );
      },
    },
    statePlugins: {
      plugin1: {
        initialState: {
          prop1: 'val1',
        },
        selectors: {
          selectProp1: (state) => state.prop1,
        },
      },
      example: {
        initialState: { color: 'white' },
        actions: {
          updateAction,
          updateActionAsync: system.createAsyncThunk(
            'example/asyncThunkStatus',
            async (val, thunkAPI) => {
              const sys = thunkAPI.extra.getSystem();
              const { updateAction: action } = sys.getActions().exampleActions;
              const test = await val;

              thunkAPI.dispatch(action(val));

              return test;
            }
          ),
        },
        selectors: {
          selectColor: (state, arg) => `${state.color}-${arg}`,
        },
        reducers: {
          [updateAction]: (state, action) => ({ ...state, color: action.payload }),
        },
      },
    },
  };
};

const Plugin2 = (system) => ({
  afterLoad(sys) {
    const { selectProp1 } = sys.plugin1Selectors;
    const { selectProp2 } = sys.plugin2Selectors;

    this.statePlugins.plugin2.selectors.selectAggregate = sys.createSelector(
      () => selectProp1(),
      () => selectProp2(),
      (prop1, prop2) => `${prop1}${prop2}`
    );
  },
  statePlugins: {
    plugin2: {
      initialState: {
        prop2: 'val2',
      },
      actions: {
        doSomething: system.createAction('plugin2/doSomething'),
      },
      selectors: {
        selectProp2: (state) => state.prop2,
      },
    },
    example: {
      wrapSelectors: {
        selectColor: (oriSelector) => (state, ...args) => {
          return oriSelector(...args);
        },
      },
    },
  },
});

const system = new System({
  plugins: [StatePlugin, Plugin2],
});
setTimeout(() => {
  system.getSystem().exampleActions.updateAction('test');
}, 2000);

const store = system.getStore();

ReactDOM.render(
  <React.StrictMode>
    <SystemContext.Provider value={system.getSystem}>
      <Provider store={store}>
        <App />
      </Provider>
    </SystemContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
