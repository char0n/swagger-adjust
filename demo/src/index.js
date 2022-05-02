import React from 'react';
import ReactDOM from 'react-dom/client';
import { System, SystemContext, useSystemComponent } from 'swagger-adjust';
import { Provider } from 'react-redux';

import TodoListPlugin from './todo-list/plugin';
import TodoListEnhancerPlugin from './todo-list-enhancer/plugin';
import reportWebVitals from './reportWebVitals';

const plugins = [TodoListPlugin, TodoListEnhancerPlugin];
const system = new System({ plugins });
const store = system.getStore();

/**
 * This component is just responsible to render the main TodoList component.
 * We need to this to allow other plugins to override TodoListLayout.
 */

const App = () => {
  const TodoListLayout = useSystemComponent('TodoListLayout');

  return <TodoListLayout />;
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SystemContext.Provider value={system.getSystem}>
        <App />
      </SystemContext.Provider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
