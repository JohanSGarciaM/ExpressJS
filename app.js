require('dotenv').config();
const express = require('express');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

//Middlewares
const errorHandler = require('./src/middlewares/errorHandle');
const loggerMiddleware = require('./src/middlewares/logger')
const authenticateToken = require('./src/middlewares/auth');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(loggerMiddleware);


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function validateEmail(email) {
    return emailRegex.test(email);
}


const PORT = parseInt(process.env.PORT?.trim(), 10) || 3000;

process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada:', err);
});
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
    if (!data || Object.keys(data).length === 0){
        return res.status(400).json({error: 'No se recibieron los datos'});
    }
    res.status(201).json({
        message: 'Datos Json recibidos!',
        data
    })
});

app.get('/users', ( req , res ) => {
    fs.readFile(usersFilePath, 'utf8', ( err , data ) =>{
        if (err){
            return res.status(500).json({error: 'Error con la base de datos'});
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

app.post('/users', ( req , res ) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.email){
        return res.status(400).json({error: 'Los campos son obligatorios'});
    }
    if (newUser.name.length < 3){
        return res.status(400).json({error: 'El nombre es muy corto'});
    }
    if(!validateEmail(newUser.email)){
        return res.status(400).json({error: 'El email no es válido'});
    }
    fs.readFile(usersFilePath, 'utf8', (err,data) => {
        if(err){
            return res.status(500).json({error: 'Error con el servidor'});
        }
        const users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err){
                return res.status(500).json({error: 'Error al guardar el usuario'});
            }
            res.status(201).json(newUser);
        });
    });
});

app.put('/users/:id', ( req , res ) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    fs.readFile(usersFilePath, 'utf8', ( err , data ) => {
        if(err){
            return res.status(500).json({error: 'Error con conexión de datos'});
        }
        let users = JSON.parse(data);
        users = users.map(user => 
            user.id === userId ? {...user, ...updatedUser} : user
        );
        fs.writeFile(usersFilePath, JSON.stringify(users, null , 2), (err) =>{
            if(err){
                return res.status(500).json({error: 'Error al actualizar el usuario'});
            }
            res.json(updatedUser);
        });
    });
});

app.delete('/users/:id', ( req , res ) => {
    const userId = parseInt(req.params.id, 10);
    fs.readFile(usersFilePath, 'utf8', (err , data) => {
        if (err){
            return res.status(500).json({error: 'Error con conexión de datos'});
        }
        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId );
        fs.writeFile(usersFilePath, JSON.stringify(users, null , 2), (err) => {
            if (err){
                return res.status(400).json({error: 'Error al eliminar un usuario.'});
            }
            res.status(204).send();
        });
    });
});

app.get('/error',  ( req , res , next) => {
    next(new Error('Error intencional')); 
})

app.get('/db-users', async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    }catch (error){
        res.status(500).json({error: 'Error al comunicarse con la bd.'});
    }
});

app.get('/protected-route', authenticateToken, (req, res) => {
    res.send('Esta es una ruta protegida.');
});

app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'USER'
        }
    });

    res.status(201).json({ message: 'User Registered Successfully'});
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({ where: { email }});

    if (!user) return res.status(400).json({ error: 'Invalid email or password'});

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) return res.status(400).json({ error: 'Invalid email or password'});

    const token = jwt.sign(
        { id: user.id, role: user.role},
         process.env.JWT_SECRET, 
        {expiresIn: '4h'}
    );

    res.json({ token });
});

app.use(errorHandler);
app.listen(PORT, () => {
    console.log("TIPO:", typeof PORT);
    console.log("VALOR:", PORT);
    console.log(`Servidor: http://localhost:${PORT}`);
});
