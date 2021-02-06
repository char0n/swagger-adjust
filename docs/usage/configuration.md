# Configuration

This section describes main `System` configuration options.

Configuration option | Type | Default | Description
--- | --- | --- | --- 
<a name="initialState"></a>`initialState` | `Object` | `{}` | Initial state for the root reducer.
<a name="initialPluginState"></a>`initialPluginState` | `Object` | `{}` | Initial state for state plugin which doesn't define it's initial state.
<a name="pluginStateAccessor"></a>`pluginStateAccessor` | `Function` | `(sliceName, state) => state[sliceName]` | Defines a mechanism for accessing a state slice. You don't need to touch this unless you plan to use Immutable.js.
<a name="plugins"></a>`plugins` | `Array` | `[]` | List of state plugins or presets.
<a name="middlware"></a>`middlware` | `Array` &#124; `Function` | `(system) => (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: { getSystem: system.getSystem } } })` | Gives complete control over redux store middleware. Please refer to this [documentation](https://redux-toolkit.js.org/api/getDefaultMiddleware) about more details. 
<a name="configs"><a/>`configs` | `Object` | `{}` | Arbitrary configuration options for applications build on top of Swagger Adjust.

