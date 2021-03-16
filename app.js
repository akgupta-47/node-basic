const express = require('express');
const morgan = require('morgan');
const app = express();
const basicRouter = require('./routes/basicRoute');
app.use(express.json());
app.use(morgan('dev'));

app.use('/',basicRouter);       

module.exports = app;