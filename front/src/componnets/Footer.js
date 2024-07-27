import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useChildName } from './ChildNameContext';

const socket = io(`${process.env.REACT_APP_WS_URL}`);

function Footer() {
  const { childName } = useChildName();
  const [letraSorteada, setLetraSorteada] = useState('');
  const [pontos, setPontos] = useState(0);

  const atualizarPontos = useCallback(async () => {
    if (!childName) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/pontos/${encodeURIComponent(childName)}`); 
      if (!response.ok) {
        throw new Error('Erro ao buscar pontos');
      }
      const data = await response.json();
      if (data.totalPontos !== undefined) {
        setPontos(data.totalPontos);
      } else {
        console.warn(`Pontos não encontrados para o usuário ${childName}.`);
        setPontos(0); 
      }
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
      setPontos(0); 
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
        <h2>Pontos</h2>
        <div className="display">
          {letraSorteada} | {pontos}
        </div>
        <button onClick={handleButtonClick}>Sortear Letra</button>
      </footer>
    </div>
  );
}

export default Footer;
