# Swagger Adjust Overview

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

> Note: when building a large plugin it's recommended to divide it into features (as we would usually
> do with larger React codebase). In this case, make `swagger-adjust` and `@reduxjs/toolkit` your peerDependencies which open
> possibility to import hooks and other APIs directly into your code from `swagger-adjust` or `@reduxjs/toolkit` packages.
