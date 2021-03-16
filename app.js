const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.status(200).json({
        message: 'hola from the server side!!', app: 'test-login'
    })
})

module.exports = app;