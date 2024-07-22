import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useChildName } from './ChildNameContext';

const socket = io('http://localhost:3000');

function Footer() {
  const { childName } = useChildName();
  const [letraSorteada, setLetraSorteada] = useState('');
  const [pontos, setPontos] = useState(0);


  const atualizarPontos = useCallback(async () => {
    if (!childName) return; 

    try {
      const response = await fetch(`http://localhost:3000/api/users/pontos/${encodeURIComponent(childName)}`);
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
