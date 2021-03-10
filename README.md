# Swagger Adjust

Swagger Adjust is a plugin-able framework for building [React](https://reactjs.org/) + [Redux](https://redux.js.org/) based applications.
This framework was born by decoupling ideas of plugin-able core of [SwaggerUI](https://github.com/swagger-api/swagger-ui) into 
separate reusable component.

To learn more about why this framework was born, please read our **[release article](https://www.linkedin.com/pulse/how-swagger-adjust-can-help-you-build-extensible-reactredux-gorej/)**. 

<p align="center">
  <img alt="Logo borrowed from: https://www.reprezen.com/blog/pluggable-extensions-to-the-openapi-specification-language" src="https://raw.githubusercontent.com/char0n/swagger-adjust/main/logo.png">
</p>

## General

Swagger Adjust allows you to build React + Redux applications in a way, where every component, being
it a React Component, Redux state slice composed of actions, selector, reducers or general business
logic is overridable and extensible. 

## Demo

We have a working demo of TodoList app built using this library. The demo consist of two
plugins: `todoList` and `todoListEnhancer`. `todoList` plugin has basic functionality 
of displaying list of todo items and adding a new one. `todoListEnhancer` add additional
functionality like completing, deleting and also adds batch operations on todo list.

You can run the demo in your browser at: https://char0n.github.io/swagger-adjust/

You can find demo source code in [demo directory](https://github.com/char0n/swagger-adjust/tree/main/demo/src) of this repository.

## Documentation

#### Usage

- [Installation](docs/usage/installation.md)
- [Configuration](docs/usage/configuration.md)
- [API](docs/usage/api.md)
- [Hooks API](docs/usage/hooks-api.md)
- [System API](docs/usage/system-api.md)
- [Development](docs/usage/development.md)

#### Customization

- [Overview](docs/customization/overview.md)
- [Plugin API](docs/customization/plugin-api.md)
