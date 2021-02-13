import { useContext } from 'react';
import { identical, memoizeWith, identity, path } from 'ramda';
import { isFunction, ensureArray } from 'ramda-adjunct';
import { useSelector, shallowEqual } from 'react-redux';

import SystemContext from './context';

export const useSystem = () => {
  const getSystem = useContext(SystemContext);
  return isFunction(getSystem) ? getSystem() : null;
};

export const useSystemSelector = (namespace, selectorName, ...args) => {
  const system = useSystem();
  const systemSelector = system[`${namespace}Selectors`][selectorName];
  const selectorThunk = () => systemSelector(...args);

  return useSelector(selectorThunk, identical);
};

export const useSystemSelectorShallowEqual = (namespace, selectorName, ...args) => {
  const system = useSystem();
  const systemSelector = system[`${namespace}Selectors`][selectorName];
  const selectorThunk = () => systemSelector(...args);

  return useSelector(selectorThunk, shallowEqual);
};

export const useSystemActionCreator = (namespace, actionName) => {
  const system = useSystem();
  return system.getActions()[`${namespace}Actions`][actionName];
};

export const useSystemActionCreatorBound = (namespace, actionName) => {
  const system = useSystem();
  return system[`${namespace}Actions`][actionName];
};

export const useSystemComponent = memoizeWith(identity, (componentName) => {
  const system = useSystem();
  return system.getComponents(componentName);
});

export const useSystemFn = (name) => {
  const system = useSystem();
  return path(ensureArray(name), system.fn);
};

export const useSystemHook = (hookName) => {
  const system = useSystem();
  return system.getHooks()[hookName];
};
