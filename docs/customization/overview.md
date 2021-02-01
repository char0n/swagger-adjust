# Plugin system overview

### Prior art

Swagger Adjust leans heavily on concepts and patterns found in React and Redux.
The ideas implemented in Swagger Adjust are already standardized by [Redux Toolkit](https://redux-toolkit.js.org/).

If you aren't already familiar, here's some suggested reading:

- [React: Quick Start (reactjs.org)](https://reactjs.org/docs/hello-world.html)
- [Redux README (redux.js.org)](http://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

In the following documentation, we won't take the time to define the fundamentals covered in the resources above.

> **Note**: Some examples in this section contain JSX, which is a syntax extension to JavaScript that is useful for writing React components.
>
> If you don't want to set up a build pipeline capable of translating JSX to JavaScript, take a look at [React without JSX (reactjs.org)](https://reactjs.org/docs/react-without-jsx.html). You can use our `system.React` reference to leverage React without needing to pull a copy into your project.

### The System

The _system_ is the heart of the Swagger Adjust. At runtime, it's a JavaScript object that holds many things:

- bound and unbound Redux actions
- Redux reducers and initial state
- bound state slice selectors
- system-wide collection of available components and hooks
- References to the React, Redux and Redux Toolkit libraries (`system.React`, `system.createAction`, `system.createSelector`, ...)
- user-defined helper functions

The system is built up when Swagger Adjust is called by iterating through ("compiling") 
each plugin that Swagger Adjust has been given, through the `plugins` configuration options.

### Presets

Presets are arrays of plugins, which are provided to Swagger Adjust through the `plugins` configuration option. 

```javascript
const MyPreset = [FirstPlugin, SecondPlugin, ThirdPlugin]

const system = new System({
  plugins: MyPreset,
})
```

### Hooks API

This section already assumes that reader is familiar with [React Hooks](https://reactjs.org/docs/hooks-overview.html) concept.
System provides a modern and standardized API to get access to everything registered withing the system via Hooks.
In order for all hooks to work, `System` and `Store` needs to be available via React Context.
Please refer to [installation instruction](../usage/installation.md) how to achieve that.

##### useSystem()

Access the `System` directly within the React Component.

```js
const Component = () => {
  const system = useSystem();
  
  return (
    <div>{system.React.version}</div>
  );
};
```

##### useSystemSelector(namespace, selectorName, ...args)

Access the bound selector from a particular namespace (state slice). The hook consumes additional
arguments that will be passed to the underlying bound selector to compute its value.

```js
const Component = ({ userId }) => {
  const user = useSystemSelector('users', 'selectUser', userId);
  
  return (
    <div>{user.id}</div>
  );
};
```

##### useSystemSelectorShallowEqual(namespace, selectorName, ...args)

The same as above, except the hooks is using `shallow equality` to compare last and 
current selected value. More about this in [React Redux documentation](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates).
The hook consumes additional arguments that will be passed to the underlying bound selector to compute its value.

```js
const Component = ({ userId }) => {
  const user = useSystemSelectorShallowEqual('users', 'selectUser', userId);
  
  return (
    <div>{user.id}</div>
  );
};
```

##### useSystemActionCreator(namespace, actionName)

Access the `unbound` Flux Standard Action creator from the System.

```js
const Component = ({ userData }) => {
  const createNewUser = useSystemActionCreator('users', 'createNewUser');
  const dispatch = useDispatch();
  
  const handleCreateNewUser = () => dispatch(createUser(userData));
    
  return (
    <button onClick={handleCreateUser}>{userData}</button>
  );
};
```


##### useSystemActionCreatorBound(namespace, actionName)

Access the `bound` Flux Standard Action creator from the System. The action creator
is already aware of dispatch and calling it will dispatch the action that it's creating.

```js
const Component = ({ userData }) => {
  const createNewUser = useSystemActionCreatorBound('users', 'createNewUser');
  
  const handleCreateNewUser = () => createUser(userData);
    
  return (
    <button onClick={handleCreateUser}>{userData}</button>
  );
};
```

##### useSystemComponent(componentName)

All components should be loaded through this hook, since it allows other plugins to modify the component. 
It is preferred over a conventional `import` statement/function or `require` function.

```js
const App = () => {
  const Header = useSystemComponent('Header');
  const Main = useSystemComponent('Main');
  const Footer = useSystemComponent('Footer');
  
  return (
    <div>
      <Header />
      <Main />
      <Footer />  
    </div>  
  );
};
```

##### useSystemHook(hookName)

Access the hook registered with the `System` identified by a `hookName`.

```js
const App = () => {
  const useSystemComponent = useSystemHook('useSystemComponent');
  const Header = useSystemComponent('Header');
  const Main = useSystemComponent('Main');
  const Footer = useSystemComponent('Footer')
  
  return (
    <div>
      <Header />
      <Main />
      <Footer />  
    </div>  
  );
};
```

> Note: when building a large plugin it's recommended to divide it into features (as we would usually
> do with larger React codebase). In this case, make `swagger-adjust` your peerDependency which open
> possibility to import hooks and other APIs directly into your code from `swagger-adjust` package.
