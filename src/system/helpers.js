import { mergeDeepRight, mapObjIndexed, path, isEmpty, keys, hasPath } from 'ramda';
import { isArray, isPlainObject, isFunction, isNotArray, isNotFunction } from 'ramda-adjunct';

export const systemExtend = (dest = {}, src = {}) => {
  /* eslint-disable no-param-reassign */
  if (!isPlainObject(dest)) {
    return {};
  }
  if (!isPlainObject(src)) {
    return dest;
  }

  /**
   * Wrap components.
   * Parses existing components in the system, and prepares them for wrapping via getComponents.
   */
  if (isPlainObject(src.wrapComponents)) {
    mapObjIndexed((wrapperFn, key) => {
      const originalComponent = path(['components', key], dest);
      if (isArray(originalComponent)) {
        dest.components[key] = originalComponent.concat([wrapperFn]);
        delete src.wrapComponents[key];
      } else if (isFunction(originalComponent)) {
        dest.components[key] = [originalComponent, wrapperFn];
        delete src.wrapComponents[key];
      }
    }, src.wrapComponents);

    /**
     * only delete wrapComponents if we've matched all of our wrappers to components
     * this handles cases where the component to wrap may be out of our scope,
     * but a higher recursive `combinePlugins` call will be able to handle it.
     */
    if (isEmpty(src.wrapComponents)) {
      delete src.wrapComponents;
    }
  }

  /**
   * Account for wrapActions, make it an array and append to it.
   * Modifies `src`.
   * 80% of this code is just safe traversal. We need to address that ( ie: use a lib ).
   */
  const { statePlugins } = dest;
  if (isPlainObject(statePlugins)) {
    keys(statePlugins).forEach((namespace) => {
      const namespaceObj = statePlugins[namespace];
      if (!isPlainObject(namespaceObj) || !isPlainObject(namespaceObj.wrapActions)) {
        return;
      }
      const { wrapActions } = namespaceObj;
      keys(wrapActions).forEach((actionName) => {
        let action = wrapActions[actionName];

        // this should only happen if dest is the first plugin, since invocations after that will ensure its an array
        if (isNotArray(action)) {
          action = [action];
          wrapActions[actionName] = action; // put the value inside an array
        }

        if (hasPath(['statePlugins', namespace, 'wrapActions', actionName], src)) {
          src.statePlugins[namespace].wrapActions[actionName] = wrapActions[actionName].concat(
            src.statePlugins[namespace].wrapActions[actionName]
          );
        }
      });
    });
  }
  /* eslint-enable no-param-reassign */

  return mergeDeepRight(dest, src);
};

export const combinePlugins = (plugins, system) => {
  if (isPlainObject(plugins) && !isArray(plugins)) {
    return { ...plugins };
  }

  if (isFunction(plugins)) {
    return combinePlugins(plugins(system), system);
  }

  if (isArray(plugins)) {
    // eslint-disable-next-line no-unused-vars
    return plugins.map((plugin) => combinePlugins(plugin, system)).reduce(systemExtend, {});
  }

  return {};
};

export function wrapWithTryCatch(fn, { logErrors = true } = {}) {
  if (isNotFunction(fn)) {
    return fn;
  }

  return function wrapper(...args) {
    try {
      return fn.call(this, ...args);
    } catch (error) {
      if (logErrors) {
        console.error(error); // eslint-disable-line no-console
      }
      return null;
    }
  };
}

export function callAfterLoad(plugins, system, { hasLoaded } = {}) {
  let calledSomething = hasLoaded;
  if (isPlainObject(plugins) && !isArray(plugins)) {
    if (isFunction(plugins.afterLoad)) {
      calledSomething = true;
      wrapWithTryCatch(plugins.afterLoad).call(this, system);
    }
  }

  if (isFunction(plugins)) {
    return callAfterLoad.call(this, plugins(system), system, { hasLoaded: calledSomething });
  }

  if (isArray(plugins)) {
    return plugins.map((plugin) =>
      callAfterLoad.call(this, plugin, system, { hasLoaded: calledSomething })
    );
  }

  return calledSomething;
}
