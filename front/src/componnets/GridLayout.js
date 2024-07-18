import React, { useState, useEffect } from 'react';
import './GridLayout.css';
import Header from './Header';
import Footer from './Footer';

function GridLayout({ childName }) {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState({
    name: childName,
    nome: '',
    pais: '',
    objeto: '',
    cor: '',
    animal: ''
  });

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
  }, [step]);

  const handleNext = () => {
    if (step <= questions.length) {
      const currentQuestion = questions[step - 1];
      setAnswers({ ...answers, [currentQuestion.field]: inputValue });
      setInputValue('');
      setStep(step + 1);
    }
  };

  return (
    <div className="angry-grid">
      <Header />
      <div id="item-2">
        <main>
          <h2>A letra sorteada foi:</h2>
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
              <button>STOP</button>
            </div>
          )}
        </main>
      </div>
      <Footer childName={childName} />
    </div>
  );
}

export default GridLayout;
