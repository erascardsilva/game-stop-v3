const express = require('express');
const app = express();
const router = require('./routes/routes');
const PORT = 3000;
const db = require('./data/data'); 

app.use(express.json());
app.use('/game', router);

app.listen(PORT, () => {
    console.log(`Rodando API na porta ${PORT}`);
});
