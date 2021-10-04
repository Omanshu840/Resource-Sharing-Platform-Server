const requestLogger = (request, _, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
}
  
const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send('We are facing an issue at the moment! Please try again later');
}
  

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}