# Installation

```sh
 $ npm install swagger-adjust
```

## Setting up

Here is an example of setting-up Swagger Adjust in minimal example configuration.
Alpha and Omega is the `System` instance. System registers components, create redux store
and provide modern React/Redux API for working with it. System is provided to the application
via it's React `SystemContext` as demonstrated below.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import System, { SystemContext, useSystemComponent } from 'swagger-adjust';

const system = new System({
  components: {
    App: () => {
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
    },
    Header: () => <div>header</div>,
    Main: () => <main>main</main>,
    Footer: () => <footer>footer</footer>,
  }
});
const store = system.getStore();

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
```
