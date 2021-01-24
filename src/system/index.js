import {
  configureStore,
  bindActionCreators,
  createAsyncThunk,
  createAction,
  createSelector,
} from '@reduxjs/toolkit';
import serializeError from 'serialize-error';
import {
  identity,
  pathOr,
  mergeDeepRight,
  compose,
  filter,
  keys,
  map,
  transduce,
  toPairs,
  mapObjIndexed,
  pipe,
  path,
  defaultTo,
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

import {
  combinePlugins,
  systemExtend,
  callAfterLoad,
  buildReducer,
  wrapWithTryCatch,
} from './helpers';

export default class System {
  initialState = {};

  plugins = [];

  system = {
    configs: {},
    fn: {},
    components: {},
    rootInjects: {},
    statePlugins: {},
  };

  boundSystem = null;

  constructor(config = {}) {
    this.initialState = pathOr({}, ['initialState'], config);
    this.plugins = pathOr([], ['plugins'], config);
    this.system = mergeDeepRight(this.system, pathOr({}, ['system'], config));
    this.store = configureStore({
      preloadedState: this.initialState,
      reducer: identity,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore these field paths in all actions
            ignoredActionPaths: ['payload'],
          },
          thunk: {
            extraArgument: {
              getSystem: this.getSystem,
              ...pathOr({}, ['thunk', 'extraArgument'], config),
            },
          },
        }),
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

  buildSystem(buildRootReducer = true) {
    const { getState, dispatch } = this.getStore();

    this.boundSystem = {
      ...this.getRootInjects(),
      ...this.getWrappedAndBoundActions(dispatch),
      ...this.getWrappedAndBoundSelectors(getState, this.getSystem),
      ...this.getStateThunks(getState),
      fn: this.getFn(),
      configs: this.getConfigs(),
    };

    if (buildRootReducer) {
      this.rebuildReducer();
    }
  }

  getRootInjects() {
    return {
      getSystem: this.getSystem,
      getStore: this.getStore,
      getComponents: this.getComponents,
      getState: this.getStore().getState,
      getConfigs: this.getConfigs,
      getActions: this.getActions,
      createAsyncThunk,
      createSelector,
      createAction,
      ...this.system.rootInjects,
    };
  }

  rebuildReducer() {
    this.store.replaceReducer(buildReducer(this.system.statePlugins));
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

  getStates(state) {
    return keys(this.system.statePlugins).reduce((obj, key) => {
      obj[key] = state[key]; // eslint-disable-line no-param-reassign
      return obj;
    }, {});
  }

  getStateThunks(getState) {
    return keys(this.system.statePlugins).reduce((obj, key) => {
      obj[key] = () => getState()[key]; // eslint-disable-line no-param-reassign
      return obj;
    }, {});
  }

  getBoundSelectors(getState, getSystem) {
    return mapObjIndexed((obj, key) => {
      const stateName = [key.slice(0, -9)]; // selectors = 9 chars
      const getNestedState = () => path(stateName, getState());

      return mapObjIndexed(
        (fn) => (...args) => {
          let res = wrapWithTryCatch(fn).apply(null, [getNestedState(), ...args]);

          //  if a selector returns a function, g   ive it the system - for advanced usage
          if (isFunction(res)) {
            res = wrapWithTryCatch(res)(getSystem());
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
        return mapObjIndexed((prop) => process(prop), creator);
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

  setConfigs(configs) {
    this.system.configs = configs;
  }
}
