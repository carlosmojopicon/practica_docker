const express = require('express');
const ws = require('./ws');
const ip = require("ip");

const host = ip.address();
const port = 3001;

var app = express();

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
})

app.listen(port, function () {
   console.log(`Consumidor corriendo en http://${host}:${port}`);
})
