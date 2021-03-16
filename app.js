const express = require('express');

const app = express();
const basicRouter = require('./routes/basicRoute');
app.use(express.json());

app.use('/',basicRouter);       

module.exports = app;