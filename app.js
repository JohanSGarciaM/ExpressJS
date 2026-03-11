const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send(`
        <h1>Curso de ExpressJS</h1>
        <p>Esto es una aplicación NodeJS con ExpressJS</p>
        <p>Corre en el puerto ${PORT}</p>
        <p>Realizado por Sebastian Garcia <johangarciats2015@gmail.com> </p>
    `);
});

app.listen(PORT, () => {
    console.log(`Nuestra aplicación esta funcionando en el puerto ${PORT}`);
});

