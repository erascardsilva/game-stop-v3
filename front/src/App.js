import React, { useState } from 'react';
import './App.css';
import GridLayout from '../src/componnets/GridLayout';

function App() {
  const [childName, setChildName] = useState('');

  const handleNameSubmit = (name) => {
    setChildName(name);
  };

  return (
    <div className="App">
      <GridLayout onNameSubmit={handleNameSubmit} />
    </div>
  );
}

export default App;