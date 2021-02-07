# System API

System API consists of standard and extended API. Standard API is stable and is further
extended when there are plugins that extends the system.

## Standard API

Symbol | Type | Description
--- | --- | --- 
`getSystem` | `Function` | When called returns current system instance.
`getStore` | `Function` | When called returns current store instance.
`getComponents` | `Function` | When called returns map of all React components registered within system. Can be called with single argument `getComponents(componentName)` and in that case returns single component.
`getHooks` | `Function` | When called returns map of all registered React hooks.
`getState` | `Function` | Returns the current state tree of your application. It is equal to the last value returned by the root reducer.
`getConfigs` | `Function` | Return arbitrary configs of your application.
`getActions` | `Function` | Returns a map of unbound action creators. If `plugin1` and `plugin2` were registered with the system, the result will be `{ plugin1Actions: { action1, action2 }, plugin2Actions: { action1, action 2} }`.
`createAsyncThunk` | `Function` | A function that accepts a Redux action type string and a callback function that should return a promise. More information [here](https://redux-toolkit.js.org/api/createAsyncThunk).
`createSelector` | `Function` | Takes one or more selectors, or an array of selectors, computes their values and passes them as arguments to resultFunc. More info [here](https://redux-toolkit.js.org/api/createSelector).
`createAction` | `Function` | A helper function for defining a Redux action type and creator. More information [here](https://redux-toolkit.js.org/api/createAction).
`React` | `Object` | Default export of [react](https://www.npmjs.com/package/react) library.
`hooks` | `Object` | Contains map of all registered React hooks. This is a result of calling `getHooks` function. Default registered hooks are `{ useSystemComponent, useSystemActionCreator, useSystemActionCreatorBound, useSystem, useSystemSelector, useSystemSelectorShallowEqual }`.
`fn` | `Object` | Contains map of all helper function registered with system. Without any plugin registered with the system, the default value is `{}` (empty object).
`configs` | `Object` | Contains arbitrary configuration options for the application using the system. Default value is `{}` empty object. 

## Extended API

Given these plugins register with the system the standard API is extended by following symbols.

```js
const MyPlugin1 = (system) => ({
  rootInjects: {
    injectedString1: 'string',
  },
  fn: {
    noop1: () => {},
  },
  statePlugins: {
    plugin1: {
      initialState: {
        prop: 'value1',
      },
      actions: {
        action1: system.createAction('plugin1/action1'),
        action2: system.createAction('plugin1/action2'),
      },
      selectors: {
        selectProp: (state) => state.prop,
      },
    },
  },
});

const MyPlugin2 = (system) => ({
  rootInjects: {
    injectedString2: 'string',
  },
  fn: {
    noop2: () => {},
  },
  statePlugins: {
    plugin2: {
      initialState: {
        prop: 'value2',
      },
      actions: {
        action1: system.createAction('plugin2/action1'),
        action2: system.createAction('plugin2/action2'),
      },
      selectors: {
        selectProp: (state) => state.prop,
      },
    },
  },
});
```

Symbol | Type | Description
--- | --- | --- 
`injectedString1` | `String` | This is root inject from `plugin1`.
`injectedString2` | `String` | This is root inject from `plugin2`.
`fn` | `Object` | Contains map of plugin registered helpers: `{ noop1, noop2 }`.
`plugin1` | `Function` | When called returns current state of the `plugin1`. Basically acts as an input selector.
`plugin2` | `Function` | When called returns current state of the `plugin2`. Basically acts as an input selector.
`plugin1Actions` | `Object` | Contains map of bound action creators specific to `plugin1`: `{ action1, action2 }`.
`plugin2Actions` | `Object` | Contains map of bound action creators specific to `plugin2`: `{ action1, action2 }`.
`plugin1Selectors` | `Object` | Contains map of bound selectors specific to `plugin1`: `{ selectProp }`.
`plugin2Selectors` | `Object` | Contains map of bound selectors specific to `plugin2`: `{ selectProp }`.
