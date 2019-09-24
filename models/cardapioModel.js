const fs = require("fs");
const path = require("path");

let cardapio;

exports.ultimoId = () => {
  let id = -1;
  cardapio.forEach(c => {
    // eslint-disable-next-line prefer-destructuring
    if (c.id > id) id = c.id;
  });
  return id;
};

exports.salvaJSON = callback => {
  const cardapioJSON = JSON.stringify(cardapio);
  fs.writeFile(
    path.join(__dirname, "..", "arquivos", "cardapio.json"),
    cardapioJSON,
    "utf-8",
    callback
  );
};

const leJSON = () => {
  const dados = fs.readFileSync(
    path.join(__dirname, "..", "arquivos", "cardapio.json"),
    "utf-8"
  );
  cardapio = JSON.parse(dados);
  return cardapio;
};

cardapio = leJSON();
exports.cardapio = cardapio;
