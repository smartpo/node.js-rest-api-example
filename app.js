import express from'express';
import config from './config';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';

//Init App
const app = express();

app.use(cors());
app.use(logger(':date :method :url - :status - :response-time ms'));

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//Main
app.get('/', (request, response) => {
  response.json({
    status: true
  });
});

//Routes
app.use(routes.users);

//Catch 404 and forward to error handler
app.use((request, response, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    status: false,
    error: error.message 
  });
});

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});