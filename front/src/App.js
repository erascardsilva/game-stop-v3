/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import GridLayout from './componnets/GridLayout'; // Caminho original
import { sendMessage, socket } from './componnets/websocket'; // Caminho original
import { ChildNameProvider } from './componnets/ChildNameContext'; // Caminho original

function App() {
  const [childName, setChildName] = useState('');
  const [receivedMessage, setReceivedMessage] = useState(''); 

  useEffect(() => {
    // Configurar o listener para a mensagem do WebSocket
    socket.on('letraSorteada', (data) => {
      console.log('Letra sorteada:', data.letra);
      setReceivedMessage(data.letra); // Atualiza o estado com a letra sorteada
    });

    // Limpar o listener ao desmontar o componente
    return () => {
      socket.off('letraSorteada');
    };
  }, []); // Dependência vazia para executar apenas uma vez ao montar

  const handleNameSubmit = (name) => {
    setChildName(name);
    sendMessage('sorteiaLetra'); 
  };

  return (
    <ChildNameProvider value={{ childName, setChildName }}> {/* Envolva o GridLayout com o Provider */}
      <div className="App">
        <GridLayout onNameSubmit={handleNameSubmit} />
        
      </div>
    </ChildNameProvider>
  );
}

export default App;
