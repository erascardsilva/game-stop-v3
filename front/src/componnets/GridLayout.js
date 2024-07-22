import React, { useState, useEffect } from 'react';
import './GridLayout.css'; // Certifique-se de que este arquivo CSS existe
import Header from './Header';
import Footer from './Footer';

function GridLayout() {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState({
    name: '',
    nome: '',
    pais: '',
    objeto: '',
    cor: '',
    animal: ''
  });
  const [childName, setChildName] = useState('');
  const [letraSorteada, setLetraSorteada] = useState('');

  const questions = [
    { field: 'nome', text: `${childName}, digite um nome de pessoa que inicia com a letra:` },
    { field: 'pais', text: `${childName}, digite um país, estado ou cidade que inicia com a letra:` },
    { field: 'objeto', text: `${childName}, digite um objeto que inicia com a letra:` },
    { field: 'cor', text: `${childName}, digite uma cor que inicia com a letra:` },
    { field: 'animal', text: `${childName}, digite um animal ou inseto que inicia com a letra:` }
  ];

  useEffect(() => {
    if (step <= questions.length) {
      setQuestion(questions[step - 1].text);
    }
  }, [questions, step]);

  useEffect(() => {
    if (letraSorteada) {
      setQuestion(questions.map(q => ({
        ...q,
        text: q.text.replace('letra', letraSorteada)
      }))[step - 1].text);
    }
  }, [letraSorteada, questions, step]);

  useEffect(() => {
    setAnswers(prevAnswers => ({ ...prevAnswers, name: childName }));
  }, [childName]);

  const handleNext = () => {
    if (step <= questions.length) {
      const currentQuestion = questions[step - 1];
      setAnswers(prevAnswers => ({ ...prevAnswers, [currentQuestion.field]: inputValue }));
      setInputValue('');
      setStep(step + 1);
    }
  };

  const handleNameSubmit = (name) => {
    setChildName(name);
  };

  const handleLetterDrawn = (letra) => {
    setLetraSorteada(letra);
  };

  const handleSubmit = async () => {
    let letra = letraSorteada;

    if (!childName) {
      alert('Por favor, certifique-se de que o nome da criança esteja definido.');
      return;
    }

    const dataToSend = {
      name: childName,
      nome: answers.nome,
      pais: answers.pais,
      objeto: answers.objeto,
      cor: answers.cor,
      animal: answers.animal,
      letra: letra
    };

    // Log para verificar os dados antes de enviar
    console.log('Dados a serem enviados:', dataToSend);

    try {
      const response = await fetch('http://localhost:3000/api/insere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados');
      }

      // Limpar a tela e reiniciar o estado
      setStep(1);
      setInputValue('');
      setAnswers({
        name: '',
        nome: '',
        pais: '',
        objeto: '',
        cor: '',
        animal: ''
      });
      setChildName('');
      setLetraSorteada('');
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="angry-grid">
      <Header onNameSubmit={handleNameSubmit} />
      <div id="item-2">
        <main>
          <h2>A letra sorteada foi:</h2>
          <p>{letraSorteada}</p>
          <p>{question}</p>
          {step <= questions.length ? (
            <div>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Digite aqui"
              />
              <button onClick={handleNext}>Próximo</button>
            </div>
          ) : (
            <div>
              <h2>Escrito:</h2>
              <ul>
                {Object.keys(answers).map(key => (
                  <li key={key}>{key}: {answers[key]}</li>
                ))}
              </ul>
              <button onClick={handleSubmit}>STOP</button>
            </div>
          )}
        </main>
      </div>
      <Footer childName={childName} onLetterDrawn={handleLetterDrawn} />
    </div>
  );
}

export default GridLayout;
