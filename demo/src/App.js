import logo from './logo.svg';
import './App.css';
import { useSystemSelector, useSystemComponent } from 'swagger-adjust';

const App = () => {
  const color = useSystemSelector('example', 'selectColor', 1, 2);
  const TestComponent = useSystemComponent('TestComponent');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React; color-{color}
          <TestComponent />
        </a>
      </header>
    </div>
  );
};

export default App;
