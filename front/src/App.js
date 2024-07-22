/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import GridLayout from './componnets/GridLayout'; 
import { sendMessage } from './componnets/websocket';  
import io from 'socket.io-client'; 
import { ChildNameProvider } from './componnets/ChildNameContext'; 

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


function App() {
  const [childName, setChildName] = useState('');
  const [receivedMessage, setReceivedMessage] = useState(''); 

  useEffect(() => {
    // Socket.IO
    const socket = io(SERVER_URL);

    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    socket.on('letraSorteada', (data) => {
      console.log('Letra sorteada:', data.letra);
      setReceivedMessage(data.letra); // Atualiza o estado com a letra sorteada
    });

    socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.IO');
    });

    // Limpar a conexão Socket.IO quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, []); // Dependência vazia para executar apenas uma vez ao montar

  const handleNameSubmit = (name) => {
    setChildName(name);
    sendMessage('sorteiaLetra'); 
  };

  return (
    <ChildNameProvider> {/* Envolva o GridLayout com o Provider */}
      <div className="App">
        <GridLayout onNameSubmit={handleNameSubmit} />
        <p>Mensagem recebida: {receivedMessage}</p> {/* Exibe a mensagem recebida */}
      </div>
    </ChildNameProvider>
  );
}

export default App;
