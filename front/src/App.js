/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './App.css';
import GridLayout from './componnets/GridLayout'; // Corrigido o caminho para o GridLayout
import { sendMessage } from './componnets/websocket';  // Corrige o caminho para websocket.js
import io from 'socket.io-client'; // Importa o socket.io-client

function App() {
  const [childName, setChildName] = useState('');
  const [receivedMessage, setReceivedMessage] = useState(''); // Estado para armazenar a mensagem recebida

  useEffect(() => {
    // Configurar o Socket.IO
    const socket = io('http://localhost:3000');

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
    sendMessage('sorteiaLetra'); // Envia a mensagem quando o nome for submetido
  };

  return (
    <div className="App">
      <GridLayout onNameSubmit={handleNameSubmit} />
      <p>Mensagem recebida: {receivedMessage}</p> {/* Exibe a mensagem recebida */}
    </div>
  );
}

export default App;
