# Plugins

A plugin is a function that returns an object - more specifically, the object may contain functions
and components that augment and modify functionality of the application build with `swagger-adjust`.

### Format

A plugin return value may contain any of these keys, where `sliceName` is a name for a slice of state:
> Note: `sliceName` may also be refereed to as `namespace`.

```js
{
  statePlugins: {
    [sliceName]: {
      actions,
      initialState,
      reducers,
      selectors,
      wrapActions,
      wrapSelectors
    }
  },
  components: {},
  hooks: {},
  wrapComponents: {},
  rootInjects: {},
  afterLoad: (system) => {},
  fn: {},
}
```

### System is provided to plugins

Let's assume we have a plugin, `NormalPlugin`, that exposes a `doStuff` action under the `normal` state namespace.

```js
const ExtendingPlugin = (system) => ({
  statePlugins: {
    extending: {
      actions: {
        doExtendedThings(...args) {
          // you can do other things in here if you decide to
          return system.normalActions.doStuff(...args);
        },
      },
    },
  },
});
```

As you can see, each plugin is passed a reference to the unbound `system` being built up. As long as `NormalPlugin` is compiled before `ExtendingPlugin`, this will work without any issues.

There is no dependency management built into the plugin system, so if you create a plugin that relies on another, it is your responsibility to make sure that the dependent plugin is loaded _after_ the plugin being depended on.

### Interfaces

#### Actions

```js
const MyActionPlugin = (system) => ({
  statePlugins: {
    example: {
      actions: {
        updateFavoriteColor: (str) => {
          return system.createAction('example/udateFavoriteColor')
        },
      },
    },
  },
});
```

Once an action has been defined, you can use it anywhere that you can get a system reference:

```js
// elsewhere
system.exampleActions.updateFavoriteColor("blue")
```

The Action interface enables the creation of new Redux action creators within a state slice in the system.
It is recommended to use `system.createAction` to define new action creators. Read more about [createAction](https://redux-toolkit.js.org/api/createAction).

This bound/unbound action creators can be exposed to components via `useSystemActionCreator` or `useSystemActionCreatorBound` hooks respectively.
When this action creator is called, the return value (which should be a [Flux Standard Action](https://github.com/acdlite/flux-standard-action)) will be passed to the `example` reducer,
which we'll define in the next section. 

For more information about the concept of actions in Redux, see the [Redux Actions documentation](http://redux.js.org/docs/basics/Actions.html).

#### Initial state

Initial state can be provided to a plugin even without need to define reducers.

```js
const MyReducerPlugin = (system) => ({
  statePlugins: {
    example: {
      initialState: {
        favColor: 'red'
      },
    },
  },
});
```

#### Reducers

Reducers take a state, an action and return a new state.

Reducers must be provided to the system under the name of the action type that they handle, in this case, `example/udateFavoriteColor`.

```js
const MyReducerPlugin = (system) => { 
  const updateFavoriteColor = system.createAction('example/updateFavoriteColor');
  
  return {
    statePlugins: {
      example: {
        initialState: {
          favColor: 'red'
        },
        actions: {
          updateFavoriteColor
        },
        reducers: {
          [updateFavoriteColor]: (state, action) => {
            /**
             * You're only working with the state slice under the the name of "example".
             * So you can do what you want, without worrying about /other/ namespaces.
             */
            state.favColor = action.payload;
          },
        },
      },
    },
  };
};
```

###### Direct state mutations

Redux requires reducer functions to be pure and treat state values as immutable. 
While this is essential for making state updates predictable and observable, 
it can sometimes make the implementation of such updates awkward.

To make things easier, `Swagger Adjust` uses [immer](https://github.com/mweststrate/immer) to let
you write reducers as if they were mutating the state directly. In reality, the reducer receives
a proxy state that translates all mutations into equivalent copy operations.

Without [immer](https://github.com/mweststrate/immer), case reducer would look like this:

```js
reducers: {
  [updateFavoriteColor]: (state, action) => {
    return { ...state, favColor: action.payload };
  },
}
```

> Note that you're able to effectively ignore `immer` by doing what you're always used to do - using [ES6 spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).
> `immer` will detect that reducer returned a new state instead of "mutating" it.

Read more about direct state mutations in [Redux Toolkit documentation](https://redux-toolkit.js.org/api/createReducer#direct-state-mutation).

#### Selectors

Selectors reach into their namespace's state to retrieve or derive data from the state.
They're an easy way to keep logic in one place, and are preferred over passing state data directly into components.
All selector names should use of convention of starting with `select*` to distinguish them easily from everything else.


```js
const MySelectorPlugin = (system) => ({
  statePlugins: {
    example: {
      selectors: {
        selectFavoriteColor: (state) => state.favColor,
      }
    }
  }
});
```

You can also use `createSelector` helper to memoize your selectors, which is recommended for any selectors that will see heavy use.
Read more about [createSelector](https://redux-toolkit.js.org/api/createSelector);

```js
const MySelectorPlugin = (system) => {
  const selectFavoriteColor = (state) => state.favColor;
  // this selector is going to be memoized
  const selectFavoriteColorLabel = system.createSelector(
    selectFavoriteColor,
    favColor => `This is my favorite color: ${favColor}`
  );
  
  return {
    statePlugins: {
      example: {
        selectors: {
          selectFavoriteColor,
          selectFavoriteColorLabel,
        },
      },
    },
  };
};
```

Once a selector has been defined, you can use it anywhere that you can get a system reference:
```js
system.exampleSelectors.selectFavoriteColor() // gets `favColor` from state for you
```

##### Composing selectors from single plugin

You can compose selectors from **single plugin** in a classical way before you assign these
selectors to a plugin.

```js
import { createSelector } from 'swagger-adjust';

export const selectTodoList = (state) => state;

export const selectTodoListItems = createSelector(selectTodoList, (state) => state.items);
```

##### Composing selectors from different plugins

It's possible to compose selectors from different plugins by returning a function from a selector.
This function will be called with `system` as an argument. This allows you to access selectors
from different plugins.

```js
const ComposedSelectorsPlugin = () => ({
  statePlugins: {
    plugin1: {
      initialState: {
        prop1: 'val1',
      },
      selectors: {
        selectProp1: (state) => state.prop1,
      },
    },
    plugin2: {
      initialState: {
        prop2: 'val2',
      },
      selectors: {
        selectProp2: (state) => state.prop2,
        selectAggregate: () => (system) => {
          const { selectProp1 } = system.plugin1Selectors;
          const { selectProp2 } = system.plugin2Selectors;

          return `${selectProp1()}${selectProp2()}`;
        },
      },
    },
  }
});
```

Note that it's not possible to effectively memoize selectors like `selectAggregate`, which means
this approach can be effectively used only when composed selector returns `Strings` or when they return
`Objects` or `Arrays` where `shallow eqality` can be used to compare last and current selected value. 
More about this [here](../usage/hooks-api.md#usesystemselectorshallowequalnamespace-selectorname-args).


There is an alternative approach to cross-plugin selector composition demonstrated below.

```js
const ComposedSelectorsPlugin = () => ({
  afterLoad(system) {
    const { selectProp1 } = system.plugin1Selectors;
    const { selectProp2 } = system.plugin2Selectors;

    this.statePlugins.plugin2.selectors.selectAggregate = system.createSelector(
      () => selectProp1(),
      () => selectProp2(),
      (prop1, prop2) => `${prop1}${prop2}`
    );
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
    plugin2: {
      initialState: {
        prop2: 'val2',
      },
      selectors: {
        selectProp2: (state) => state.prop2,
      },
    },
  },
});
```

After all the plugins have loaded, [afterLoad](#afterload) method is called with a single argument of `system`.
We can access bound selectors from the `system` and compose them using memoized selector. Notice how
we enclosed the selector call into thunks; we're doing it due to the fact that selectors are already 
bound to their state slice and state doesn't need to be provided to them explicitly. 
Then we dynamically assign a new composed selector to plugin2 selectors. 
Once code inside `afterLoad` has finished executing, the `system` is going to be recompiled and
composed selector will be accessible.

```js
system.plugin2Selectors.selectAggregate() // gets `val1val2` from multiple state slices for you
```

#### Components

You can provide a map of components to be integrated into the system.

Be mindful of the key names for the components you provide, as you'll need to use those names to refer to the components elsewhere.
Please also be aware that component names are global and are not specific to a plugin that they are defined in.

```js
const HelloWorld = () => (
  <h1>Hello World!</h1>
);

const MyComponentPlugin = (system) => ({
  components: {
    HelloWorld,
  },
});
```

Component can be accessed either by using [useSystemComponent hook](../usage/hooks-api.md#usesystemcomponentcomponentname) 
or by using `getComponents` method on `system`.

```js
const HelloWorld = useSystemComponent('HelloWorld');
```
or
```js
const HelloWorld = system.getComponents('HelloWorld')
```

You can also "cancel out" any components that you don't want by creating a stateless component that always returns `null`:

```javascript
const NeverShowInfoPlugin = (system) => ({
  components: {
    HelloWorld: () => null
  },
});
```

#### Wrap-Actions

Wrap Actions allow you to override the behavior of an action in the system.

They are function factories with the signature `(oriAction, system) => (...args) => result`.

A Wrap Action's first argument is `oriAction`, which is the bound action creator being wrapped (not an actual action).
It is your responsibility to call the `oriAction` action creator - if you don't, the original action will not fire!

This mechanism is useful for conditionally overriding built-in behaviors or applying different messaging patterns.
Read more about messaging patterns in [Redux Book](https://leanpub.com/redux-book).

For all the following examples we'll use following plugin as a base one:

```js
const BasePlugin = (system) => ({
  statePlugins: {
    example: {
      actions: {
        updateColor: system.createAction('example/updateColor')
      },
    },
  },
});
```

##### Routing patterns

###### Filter

Filtering is useful when you have some actions, but have to dispose of some of them based on certain criteria.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    example: {
      wrapActions: {
        updateColor: (oriAction, system) => (payload) => {
          // we only allow dispatching of updateColor action if color is different than red
          if (payload !== 'red') {
            return oriAction(payload);
          }
          return undefined;
        },
      },
    },
  },
});
```

###### Mapper

Mapping refers to triggering a different side effect from an action depending on either the content of the action itself or the context of the application.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    example: {
      wrapActions: {
        updateColor: (oriAction, system) => (payload) => {
          // we map this action with sligtly different payload when color update `red` was requested
          if (payload === 'red') {
            return oriAction('purple');  
          }
          return oriAction(payload);
        },
      },
    },
  },
});
```

###### Splitter

Useful for dispatching multiple actions as a response to another action.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    example: {
      wrapActions: {
        updateColor: (oriAction, system) => (payload) => {
          // we dispatch another two actions from anotherUIPlugin before our original action is dispatched          
          system.anotherUIPlugin.updateBorderColor(payload);
          system.anotherUIPlugin.updateBackgroundColor(payload);

          return oriAction(payload);
        },
      },
    },
  },
});
```

###### Aggregator

Aggregation refers to triggering a side effect as a result of multiple actions.

```js
const MyWrappingPlugin = () => {
  let updates = 0;
  
  return {
    statePlugins: {
      example: {
        wrapActions: {
          updateColor: (oriAction, system) => (payload) => {
            updates += 1;

            // open color picker widget as user might be working a lot with colors   
            if (updates === 2) {
              system.anotherUIPlugin.openColorPicker();
            }

            return oriAction(payload);
          },
        },
      },
    },
  };
};
```

##### Transformation Patterns

###### Enricher

Enriching refers to adding missing properties to an action.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    example: {
      wrapActions: {
        updateColor: (oriAction, system) => (payload) => {          
          // enrich action payload of hex code of the color
          return oriAction({ color: payload, hex: system.fn.toHex(payload) });
        },
      },
    },
  },
});
```

###### Normalizer

Normalization - where your server returns a different structure from what is used on the client side or
when the payload need to be normalized before the action is dispatched.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    example: {
      wrapActions: {
        updateColor: (oriAction, system) => (payload) => {
          // red => [255, 0, 0]
          // #FF0000 => [255, 0, 0]
          // [255, 0, 0] => [255, 0, 0]
          
          return oriAction(toRBG(payload));
        },
      },
    },
  },
});
```

###### Translator

Sometimes we want to dispatch actions specific the UI which reducers don't really expect. 
We want to translate those actions to other actions that reducers understand.

```js
const MyWrappingPlugin = () => ({
  statePlugins: {
    uiPlugin: {
      wrapActions: {
        pickColor: (oriAction, system) => (payload) => {
          return system.exampleActions.updateColor(payload);
        },
      },
    },
  },
});
```

#### Wrap-Selectors

Wrap Selectors allow you to override the behavior of a selector in the system.

They are function factories with the signature `(oriSelector, system) => (state, ...args) => result`.

`oriSelector` is a bound selector so there is no need to provide it a state explicitly.

This interface is useful for controlling what data flows into components.

```js
const MyPlugin = (system) => ({
  statePlugins: {
    spec: {
      selectors: {
        url: state => state.url,
      },
    },
  },
});

const MyWrapSelectorsPlugin = (system) => ({
  statePlugins: {
    spec: {
      wrapSelectors: {
        url: (oriSelector, system) => (state, ...args) => {
          return oriSelector(...args)
        },
      },
    },
  },
});
```

Note that it's not possible to effectively memoize wrapped selectors, which means
this approach can be effectively used only when composed selector returns `Strings` or when they return
`Objects` or `Arrays` where `shallow eqality` can be used to compare last and current selected value.
More about this [here](../usage/hooks-api.md#usesystemselectorshallowequalnamespace-selectorname-args).


#### Wrap-Components

Wrap Components allow you to override a component registered within the system.

Wrap Components are function factories with the signature `(OriginalComponent, system) => props => ReactElement`.

```js
const MyWrapBuiltinComponentPlugin = (system) => ({
  wrapComponents: {
    Info: (Original, system) => (props) => (
      <div>
        <h3>Hello world! I am above the Info component.</h3>
        <Original {...props} />
      </div>
    ),
  },
});
```

Here's another example that includes a code sample of a component that will be wrapped:

```js
// simple number display
const MyNumberDisplayPlugin = function(system) {
  return {
    components: {
      NumberDisplay: ({ number }) => <span>{number}</span>
    }
  }
}

// simple humber display + warning about big numbers
const MyWrapComponentPlugin = (system) => ({
  wrapComponents: {
    NumberDisplay: (Original, system) => (props) => {
      const { number } = props;
      
      if(number > 10) {
        return (
          <div>
            <h3>Warning! Big number ahead.</h3>
            <Original {...props} />
          </div>
        );
      } else {
        return <Original {...props} />
      }
    },
  },
});
```

#### `rootInjects`

The `rootInjects` interface allows you to inject values at the top level of the system.

This interface takes an object, which will be merged in with the top-level system object at runtime.

```js
const MyRootInjectsPlugin = () => ({
  rootInjects: {
    myConstant: 123,
    myMethod: (...params) => console.log(...params)
  },
});
```

#### `afterLoad`

The `afterLoad` plugin method allows you to get a reference to the system after your plugin has been registered.

You can use it to execute logic that requires your plugin (and others) to already be ready, 
for example fetching initial data from a remote endpoint and passing it to an action your plugin creates.
When `afterLoad` runs you can be sure that all plugins have already been compiled.

The plugin context, which is bound to `this`, is undocumented, but below is an example of how to attach a bound action as a top-level method:

```javascript
const MyMethodProvidingPlugin = (system) => ({
  afterLoad(sys) {
    // at this point in time, your actions have been bound into the system
    // so you can do things with them
    this.rootInjects = this.rootInjects || {}
    this.rootInjects.myMethod = sys.exampleActions.updateFavoriteColor
  },
  statePlugins: {
    example: {
      actions: {
        updateFavoriteColor: system.createAction('example/updateFavoriteColor'),          
      },
    },
  },
});
```

This method is also ideal for [cross-plugin selectors composition](#composing-selectors-from-different-plugins). 

#### fn

The fn interface allows you to add helper functions to the system for use elsewhere.

```javascript
import leftPad from "left-pad"

const MyFnPlugin = (system) => ({
  fn: {
    leftPad: leftPad,
  },
});
```
