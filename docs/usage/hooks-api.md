# Hooks API

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
