// Footer.js

import React, { useState } from 'react';

function Footer({ childName }) {
  const [letraSorteada, setLetraSorteada] = useState('');
  const [pontos, setPontos] = useState(0);

  const sortearLetra = () => {
    fetch('http://localhost:3000/game/sorteia')
      .then(response => response.json())
      .then(data => {
        setLetraSorteada(data.letra);
      })
      .catch(error => {
        console.error('Erro ao sortear letra:', error);
      });
  };

  const atualizarPontos = () => {
    fetch('http://localhost:3000/game/users')
      .then(response => response.json())
      .then(users => {
        // Filtra o usuário pelo nome da criança
        const crianca = users.find(user => user.name === childName);
        if (crianca) {
          setPontos(crianca.pontos);
        } else {
          console.warn(`Usuário ${childName} não encontrado.`);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
      });
  };

  return (
    <div id="item-1">
      <footer>
        <p>Pontos</p>
        <div className="display">{pontos}</div>
        <button onClick={sortearLetra}>Sorteio</button>
        <button onClick={atualizarPontos}>Atualizar Pontos</button>
      </footer>
    </div>
  );
}

export default Footer;
