import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Ajuste a URL conforme necessário

function Header({ onNameSubmit }) {
  const [childName, setChildName] = useState('');
  const [sorteioLetra, setSorteioLetra] = useState('');

  useEffect(() => {
    socket.on('letraSorteada', (data) => {
      setSorteioLetra(data.letra);
    });

    return () => {
      socket.off('letraSorteada');
    };
  }, []);

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
        <button onClick={handleNameSubmit}>Rodada</button>
        <p>Letra Sorteada: {sorteioLetra}</p>
      </header>
    </div>
  );
}

export default Header;
