const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');

const app = express();
// eslint-disable-next-line import/newline-after-import
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const basicRouter = require('./routes/basicRoute');

app.use(express.json());

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'));
}

app.use('/', basicRouter);
app.use('/appname/users', userRouter);

// this will run after all the routes defined by us for this applications are checked and none is matched
// therefore it is placed at end of app.js
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

// error handling express callback functions always take error/err as its first argument
app.use(globalErrorHandler);

module.exports = app;
