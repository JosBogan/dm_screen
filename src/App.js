import React from 'react';
import './App.css';

import Screen from './components/Screen'
import Search from './components/Search'

function App() {
  return (
    <div className="background">
      <Search />
      <Screen />
    </div>
  );
}

export default App;
