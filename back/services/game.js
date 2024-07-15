function getRandomUpperCaseLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }
  
  function calcularPontosComBaseNaLetraSorteada( nome, pais, objeto, cor, animal, letraSorteada) {
    let pontosCalculados = 0;
  
    // Verifica se a primeira letra de cada campo corresponde à letra sorteada
   
    if (nome.charAt(0).toUpperCase() === letraSorteada) {
      pontosCalculados += 5;
    }
    if (pais.charAt(0).toUpperCase() === letraSorteada) {
      pontosCalculados += 5;
    }
    if (objeto.charAt(0).toUpperCase() === letraSorteada) {
      pontosCalculados += 5;
    }
    if (cor.charAt(0).toUpperCase() === letraSorteada) {
      pontosCalculados += 5;
    }
    if (animal.charAt(0).toUpperCase() === letraSorteada) {
      pontosCalculados += 5;
    }
  
    return pontosCalculados;
  }
  
  module.exports = {
    getRandomUpperCaseLetter,
    calcularPontosComBaseNaLetraSorteada,
  };