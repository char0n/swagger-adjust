import React from 'react';
import ReactDOM from 'react-dom';
import { System, SystemContext, useSystemComponent } from 'swagger-adjust';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import TodoListPlugin from './todo-list/plugin';

const system = new System({ plugins: [TodoListPlugin] });
const store = system.getStore();

/**
 * This component is just responsible to render the main TodoList component.
 * We need to this to allow other plugins to override TodoListLayout.
 */

const App = () => {
  const TodoListLayout = useSystemComponent('TodoListLayout');

  return <TodoListLayout />;
};

ReactDOM.render(
  <React.StrictMode>
    <SystemContext.Provider value={system.getSystem}>
      <Provider store={store}>
        <App />
      </Provider>
    </SystemContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
