import React, { useState } from 'react';

function Header({ onNameSubmit }) {
  const [childName, setChildName] = useState('');

  const handleNameSubmit = () => {
    if (childName.trim() !== '') {
      onNameSubmit(childName); // Chama a função onNameSubmit com o nome da criança
    }
  };

  return (
    <div id="item-0">
      <header>
        <h1>Stop</h1>
        <label>Digite o nome da criança:</label>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Nome da criança"
        />
        <button onClick={handleNameSubmit}>Iniciar</button>
      </header>
    </div>
  );
}

export default Header;
