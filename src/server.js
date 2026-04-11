const app = require('./app');
const PORT = parseInt(process.env.PORT?.trim(), 10) || 3000;

app.listen(PORT, () => {
    console.log("TIPO:", typeof PORT);
    console.log("VALOR:", PORT);
    console.log(`Servidor: http://localhost:${PORT}`);

});