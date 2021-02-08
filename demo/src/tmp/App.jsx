import React from 'react';

import { useSystemSelector, useSystemComponent } from './system/hooks';

const App = () => {
  const color = useSystemSelector('example', 'selectColor', 1, 2);
  const TestComponent = useSystemComponent('TestComponent');

  return (
    <main>
      {color}
      {React.version}
      <TestComponent />
    </main>
  );
};

export default App;
