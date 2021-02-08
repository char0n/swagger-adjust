import React from 'react'; // eslint-disable-line import/no-unresolved
import {
  configureStore,
  bindActionCreators,
  createAsyncThunk,
  createAction,
  createSelector,
  createReducer,
  combineReducers,
} from '@reduxjs/toolkit';
import serializeError from 'serialize-error';
import {
  identity,
  pathOr,
  mergeDeepRight,
  compose,
  filter,
  map,
  transduce,
  toPairs,
  mapObjIndexed,
  pipe,
  prop,
  path,
  defaultTo,
  isEmpty,
} from 'ramda';
import {
  isArray,
  ensureArray,
  isUndefined,
  isFunction,
  isNotFunction,
  isNotUndefined,
  isPlainObject,
} from 'ramda-adjunct';

import { combinePlugins, systemExtend, callAfterLoad, wrapWithTryCatch } from './helpers';
import {
  useSystemComponent,
  useSystemActionCreator,
  useSystem,
  useSystemSelector,
  useSystemActionCreatorBound,
  useSystemSelectorShallowEqual,
} from './hooks';

export default class System {
  initialState = {};

  initialPluginState = {};

  pluginStateAccessor = prop;

  plugins = [];

  system = {
    configs: {},
    fn: {},
    components: {},
    hooks: {
      useSystemComponent,
      useSystemActionCreator,
      useSystemActionCreatorBound,
      useSystem,
      useSystemSelector,
      useSystemSelectorShallowEqual,
    },
    rootInjects: {},
    statePlugins: {},
  };

  boundSystem = null;

  constructor(config = {}) {
    this.initialState = pathOr(this.initialState, ['initialState'], config);
    this.initialPluginState = pathOr(this.initialPluginState, ['initialPluginState'], config);
    this.pluginStateAccessor = pathOr(this.pluginStateAccessor, ['pluginStateAccessor'], config);
    this.plugins = pathOr([], ['plugins'], config);
    this.system.configs = pathOr({}, ['configs'], config);
    const middleware = pathOr(
      (system) => (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: {
              getSystem: system.getSystem,
            },
          },
        }),
      ['middleware'],
      config
    );
    this.store = configureStore({
      preloadedState: this.initialState,
      reducer: identity,
      middleware: isFunction(middleware) ? middleware(this) : middleware,
    });

    this.buildSystem(false);

    this.register(this.plugins);
  }

  getSystem = () => {
    return this.boundSystem;
  };

  getStore = () => {
    return this.store;
  };

  getConfigs = () => {
    return this.system.configs;
  };

  getFn = () => {
    return this.system.fn;
  };

  getHooks = () => {
    return this.system.hooks;
  };

  getComponents = (component) => {
    const res = this.system.components[component];

    if (isArray(res)) {
      return res.reduce((ori, wrapper) => {
        return wrapper(ori, this.getSystem());
      });
    }
    if (isNotUndefined(component)) {
      return this.system.components[component];
    }

    return this.system.components;
  };

  register(plugins, rebuild = true) {
    const pluginSystem = combinePlugins(plugins, this.getSystem());

    this.system = systemExtend(this.system, pluginSystem);

    if (rebuild) {
      this.buildSystem();
    }

    const needAnotherRebuild = callAfterLoad.call(this.system, plugins, this.getSystem());

    if (needAnotherRebuild) {
      this.buildSystem();
    }
  }

  buildSystem(forceBuildRootReducer = true) {
    const { getState, dispatch } = this.getStore();

    this.boundSystem = {
      ...this.getRootInjects(),
      ...this.getWrappedAndBoundActions(dispatch),
      ...this.getWrappedAndBoundSelectors(getState, this.getSystem),
      ...this.getStateThunks(getState),
      hooks: this.getHooks(),
      fn: this.getFn(),
      configs: this.getConfigs(),
    };

    if (forceBuildRootReducer) {
      this.rebuildRootReducer();
    }
  }

  getRootInjects() {
    return {
      getSystem: this.getSystem,
      getStore: this.getStore,
      getComponents: this.getComponents,
      getHooks: this.getHooks,
      getState: this.getStore().getState,
      getConfigs: this.getConfigs,
      getActions: this.getActions,
      createAsyncThunk,
      createSelector,
      createAction,
      React,
      ...this.system.rootInjects,
    };
  }

  rebuildRootReducer() {
    const reducedSlices = mapObjIndexed(
      ({ initialState = this.initialPluginState, reducers = {} }) =>
        createReducer(initialState, reducers),
      this.system.statePlugins
    );
    const rootReducer = isEmpty(reducedSlices)
      ? createReducer(this.initialState, identity)
      : combineReducers(reducedSlices);

    this.store.replaceReducer(rootReducer);
  }

  getType(name) {
    const capitalizedName = `${name[0].toUpperCase()}${name.slice(1)}`;
    const transducer = compose(
      filter(([, val]) => isPlainObject(val[name])),
      map(([namespace, val]) => ({ [`${namespace}${capitalizedName}`]: val[name] }))
    );

    return transduce(transducer, mergeDeepRight, {}, toPairs(this.system.statePlugins));
  }

  getSelectors = () => {
    return this.getType('selectors');
  };

  getActions = () => {
    const actionHolders = this.getType('actions');
    const transducer = compose(
      filter(([, action]) => isFunction(action)),
      map(([actionName, action]) => ({ [actionName]: action }))
    );

    return mapObjIndexed(pipe(toPairs, transduce(transducer, mergeDeepRight, {})), actionHolders);
  };

  getWrappedAndBoundActions(dispatch) {
    const actionGroups = this.getBoundActions(dispatch);

    return mapObjIndexed((actions, actionGroupName) => {
      const wrappers = this.system.statePlugins[actionGroupName.slice(0, -7)].wrapActions;

      if (isPlainObject(wrappers)) {
        return mapObjIndexed((action, actionName) => {
          let wrap = wrappers[actionName];

          if (isUndefined(wrap)) {
            return action;
          }

          wrap = ensureArray(wrap);

          return wrap.reduce((acc, fn) => {
            const newAction = (...args) => {
              return fn(acc, this.getSystem())(...args);
            };
            if (isNotFunction(newAction)) {
              throw new TypeError(
                'wrapActions needs to return a function that returns a new function (ie the wrapped action)'
              );
            }
            return wrapWithTryCatch(newAction);
          }, action || Function.prototype);
        }, actions);
      }

      return actions;
    }, actionGroups);
  }

  getWrappedAndBoundSelectors(getState, getSystem) {
    const selectorGroups = this.getBoundSelectors(getState, getSystem);

    return mapObjIndexed((selectors, selectorGroupName) => {
      const stateName = [selectorGroupName.slice(0, -9)]; // selectors = 9 chars
      const wrappers = this.system.statePlugins[stateName].wrapSelectors;

      if (isPlainObject(wrappers)) {
        return mapObjIndexed((selector, selectorName) => {
          let wrap = wrappers[selectorName];

          if (isUndefined(wrap)) {
            return selector;
          }

          wrap = ensureArray(wrap);

          return wrap.reduce((acc, fn) => {
            const wrappedSelector = (...args) => {
              return fn(acc, this.getSystem())(path(stateName, getState()), ...args);
            };
            if (isNotFunction(wrappedSelector)) {
              throw new TypeError(
                'wrapSelector needs to return a function that returns a new function (ie the wrapped action)'
              );
            }
            return wrappedSelector;
          }, selector || Function.prototype);
        }, selectors);
      }

      return selectors;
    }, selectorGroups);
  }

  getStateThunks(getState) {
    return mapObjIndexed((plugin, sliceName) => {
      return () => this.pluginStateAccessor(sliceName, getState());
    }, this.system.statePlugins);
  }

  getBoundSelectors(getState, getSystem) {
    return mapObjIndexed((obj, key) => {
      const stateName = [key.slice(0, -9)]; // selectors = 9 chars
      const getNestedState = () => this.pluginStateAccessor(stateName, getState());

      return mapObjIndexed(
        (fn) => (...args) => {
          let res = wrapWithTryCatch(fn).apply(null, [getNestedState(), ...args]);

          //  if a selector returns a function, give it the system - for advanced usage
          if (isFunction(res)) {
            res = wrapWithTryCatch(res)(getSystem());
          }
          // if selector agains return a function, call it with a current state - memoized cross-plugin selectors
          if (isFunction(res)) {
            res = res(getNestedState());
          }
          return res;
        },
        obj
      );
    }, this.getSelectors());
  }

  getBoundActions(passedDispatch) {
    const dispatch = defaultTo(passedDispatch, this.getStore().dispatch);
    const actions = this.getActions();
    const process = (creator) => {
      if (isNotFunction(creator)) {
        return mapObjIndexed((property) => process(property), creator);
      }

      return (...args) => {
        let action = null;
        try {
          action = creator(...args);
        } catch (e) {
          action = { type: 'NEW_THROWN_ERR', error: true, payload: serializeError(e) };
        }
        return action;
      };
    };

    return mapObjIndexed(
      (actionCreator) => bindActionCreators(process(actionCreator), dispatch),
      actions
    );
  }
}
