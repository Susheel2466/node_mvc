const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./validation/validationErrorHandler');

const app = express();

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: ['http://localhost:3000'],
    "methods": "GET,PUT,POST,PATCH",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    credentials: true
}));

app.use(helmet());

app.use('/user', userRoutes);

app.get('/ping', (req, res) => {
    res.end(`<html><head><title>Test Node App</title></head><body><h1 align="center">Test Application On Work</h1></body></html>`);
});  

app.use(errorHandler.handleError());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})