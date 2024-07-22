import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

// Configure o WebSocket
const socket = io('http://localhost:3000');

function Footer({ childName }) {
  const [letraSorteada, setLetraSorteada] = useState('');
  const [pontos, setPontos] = useState(0);

  // Função para buscar os usuários da API e atualizar os pontos
  const atualizarPontos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const users = await response.json();
      const crianca = users.find(user => user.name === childName);
      if (crianca) {
        setPontos(crianca.pontos);
      } else {
        console.warn(`Usuário ${childName} não encontrado.`);
        setPontos(0); // Defina os pontos como 0 se o usuário não for encontrado
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }, [childName]);

  useEffect(() => {
    const handleLetraSorteada = (data) => {
      console.log('Letra sorteada recebida:', data);
      setLetraSorteada(data.letra);
      atualizarPontos();
    };

    socket.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });

    socket.on('letraSorteada', handleLetraSorteada);

    // Atualiza os pontos ao montar o componente
    atualizarPontos();

    return () => {
      socket.off('letraSorteada', handleLetraSorteada);
      socket.off('connect');
    };
  }, [atualizarPontos]);

  const handleButtonClick = () => {
    // Emite o evento 'sorteiaLetra' para o backend via WebSocket
    socket.emit('sorteiaLetra');
  };

  return (
    <div id="item-1">
      <footer>
        <p>Pontos</p>
        <div className="display">
          {letraSorteada} | {pontos}
        </div>
        <button onClick={handleButtonClick}>Sortear Letra</button>
      </footer>
    </div>
  );
}

export default Footer;
