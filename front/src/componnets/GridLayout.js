import React, { useState, useEffect } from "react";
import "./GridLayout.css";
import Header from "./Header";
import Footer from "./Footer";
import { useChildName } from "./ChildNameContext";
import { socket } from "./websocket";

function GridLayout({ onNameSubmit }) {
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({
    name: "",
    nome: "",
    pais: "",
    objeto: "",
    cor: "",
    animal: "",
    letra: "",
  });
  const [letraSorteada, setLetraSorteada] = useState("");
  const { childName } = useChildName();

  useEffect(() => {
    socket.on("letraSorteada", (data) => {
      console.log("Letra sorteada:", data.letra);
      setLetraSorteada(data.letra);
      setAnswers((prevAnswers) => ({ ...prevAnswers, letra: data.letra }));
    });

    return () => {
      socket.off("letraSorteada");
    };
  }, []);

  // Lista de perguntas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = [
    {
      field: "nome",
      text: `${childName}, um nome de pessoa que inicia com a letra: `,
    },
    {
      field: "pais",
      text: `${childName}, um país, estado ou cidade que inicia com a letra: `,
    },
    {
      field: "objeto",
      text: `${childName}, um objeto que inicia com a letra: `,
    },
    { field: "cor", text: `${childName}, uma cor que inicia com a letra: ` },
    {
      field: "animal",
      text: `${childName}, um animal ou inseto que inicia com a letra: `,
    },
  ];

  useEffect(() => {
    if (step <= questions.length) {
      const updatedQuestion = questions[step - 1].text.replace(
        "letra",
        letraSorteada
      );
      setQuestion(updatedQuestion);
    } else {
      setQuestion("");
    }
  }, [letraSorteada, step, questions]); // Incluindo 'questions' nas dependências

  useEffect(() => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, name: childName }));
  }, [childName]);

  const handleNext = () => {
    if (step <= questions.length) {
      const currentQuestion = questions[step - 1];
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.field]: inputValue,
      }));
      setInputValue("");
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      const previousQuestion = questions[step - 2];
      setInputValue(answers[previousQuestion.field]);
    }
  };

  const handleSubmit = async () => {
    if (!childName) {
      alert(
        "Por favor, certifique-se de que o nome da criança esteja definido."
      );
      return;
    }

    const dataToSend = {
      name: childName,
      nome: answers.nome,
      pais: answers.pais,
      objeto: answers.objeto,
      cor: answers.cor,
      animal: answers.animal,
      letra: answers.letra || letraSorteada,
    };

    console.log("Dados a serem enviados:", dataToSend);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/insere`,
        {
          // Corrigido para REACT_APP_SERVER_URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar dados");
      }

      setStep(1);
      setInputValue("");
      setAnswers({
        name: "",
        nome: "",
        pais: "",
        objeto: "",
        cor: "",
        animal: "",
        letra: "",
      });
      alert("Dados enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados. Verifique o console para mais detalhes.");
    }
  };

  return (
    <div className="angry-grid">
      <Header />
      <div id="item-2">
        <main>
          <p></p>
          <h1>{question}</h1>
          <br></br>
          {step <= questions.length ? (
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite aqui"
              />
              <br></br>
              <button onClick={handleBack}>Voltar</button>
              <button onClick={handleNext}>Próximo</button>
            </div>
          ) : (
            <div>
              <h1>Escrito:</h1>
              <ul>
                {Object.keys(answers).map((key) => (
                  <li key={key}>
                    {key}: {answers[key]}
                  </li>
                ))}
              </ul>
              <button onClick={handleBack}>Voltar</button>
              <button onClick={handleSubmit}>STOP</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default GridLayout;
