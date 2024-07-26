import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useChildName } from './ChildNameContext';

const socket = io(process.env.REACT_APP_WS_URL); // Atualize para a URL do WebSocket

function Header() {
  const [sorteioLetra, setSorteioLetra] = useState('');
  const { childName, setChildName } = useChildName();
  const [inputValue, setInputValue] = useState(childName || '');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    socket.on('letraSorteada', (data) => {
      setSorteioLetra(data.letra);
    });

    return () => {
      socket.off('letraSorteada');
    };
  }, []);

  const handleNameChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNameSubmit = () => {
    if (inputValue.trim() !== '') {
      setChildName(inputValue); // Atualiza o jogador
      setIsEditing(false);
    }
  };

  return (
    <div id="item-0">
      <header>
        <h1>Stop | letra : {sorteioLetra}</h1>

        {isEditing ? (
          <input
            type="text"
            placeholder="Seu nome"
            value={inputValue}
            onChange={handleNameChange}
          />
        ) : (
          <h2>{childName}</h2>
        )}
        <button onClick={handleNameSubmit}>Rodada</button>
        <p></p>
      </header>
    </div>
  );
}

export default Header;
