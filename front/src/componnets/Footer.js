import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useChildName } from './ChildNameContext';

// Corrigido para usar REACT_APP_WS_URL
const socket = io(`${process.env.REACT_APP_WS_URL}`);

function Footer() {
  const { childName } = useChildName();
  const [letraSorteada, setLetraSorteada] = useState('');
  const [pontos, setPontos] = useState(0);

  const atualizarPontos = useCallback(async () => {
    if (!childName) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/pontos/${encodeURIComponent(childName)}`); // Corrigido para REACT_APP_SERVER_URL
      if (!response.ok) {
        throw new Error('Erro ao buscar pontos');
      }
      const data = await response.json();
      if (data.totalPontos !== undefined) {
        setPontos(data.totalPontos);
      } else {
        console.warn(`Pontos não encontrados para o usuário ${childName}.`);
        setPontos(0); // Defina os pontos como 0 se o usuário não for encontrado
      }
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
      setPontos(0); // Defina os pontos como 0 em caso de erro
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
