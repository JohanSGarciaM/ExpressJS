const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send(`
        <h1>Curso de ExpressJS</h1>
        <p>Esto es una aplicación NodeJS con ExpressJS</p>
        <p>Corre en el puerto ${PORT}</p>
        <p>Realizado por Sebastian Garcia <johangarciats2015@gmail.com> </p>
    `);
});

app.get('/users/:id', (req , res) => {
    const userId = req.params.id;
    res.send(`Mostrar información del usuario con ID: ${userId}`);
});

app.get('/search', (req , res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <h2>Resultados de Busqueda: </h2>
        <p>Término : ${terms}</p>
        <p>Categoría : ${category}</p>    
    `)
});

app.post('/form', ( req , res ) => {
    const name = req.body.name || 'Anónimo';
    const email = req.body.email || 'No proporcionado';

    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        }
    });
});

app.post('/api/data', ( req , res ) => {
    const  data = req.body;
    if (!data || Object.keys(data).legth === 0){
        return req.status(400).json({error: 'No se recibieron los datos'});
    }
    res.status(201).json({
        message: 'Datos json recibidos!',
        data
    })
});

app.listen(PORT, () => {
    console.log(`Servidor: http//localhost:${PORT}`);
});

