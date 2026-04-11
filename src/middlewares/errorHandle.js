const errorHandler = ( err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrió un error Inesperado';

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`);

    if(err.stack){
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'Error',
        statusCode,
        message
    });
};

module.exports = errorHandler;