import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useChildName } from './ChildNameContext'; 

const socket = io('http://localhost:3000'); 

function Header() {
  const [sorteioLetra, setSorteioLetra] = useState('');
  const { childName, setChildName } = useChildName(); 
  const [isEditing, setIsEditing] = useState(true); 

  useEffect(() => {
    socket.on('letraSorteada', (data) => {
      setSorteioLetra(data.letra);
    });

    return () => {
      socket.off('letraSorteada');
    };
  }, []);

  const handleNameSubmit = () => {
    const inputElement = document.querySelector('input');
    const childName = inputElement.value.trim();
    if (childName !== '') {
      setChildName(childName); // Atualiza o jogador
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
            defaultValue={childName}
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
