function letterSort() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }
  
  function calcPonts( nome, pais, objeto, cor, animal, letra) {
    let pontosCalculados = 0;
  
    if (nome.charAt(0).toUpperCase() === letra) {
      pontosCalculados += 5;
    }
    if (pais.charAt(0).toUpperCase() === letra) {
      pontosCalculados += 5;
    }
    if (objeto.charAt(0).toUpperCase() === letra) {
      pontosCalculados += 5;
    }
    if (cor.charAt(0).toUpperCase() === letra) {
      pontosCalculados += 5;
    }
    if (animal.charAt(0).toUpperCase() === letra) {
      pontosCalculados += 5;
    }
  
    return pontosCalculados;
  }
  
  module.exports = { letterSort, calcPonts,};