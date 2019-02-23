const express = require('express');
const bodyParser = require('body-parser');

const os = require('os');
const url  = require('url');
const kafka = require('kafka-node');
const ip = require("ip");

const host = ip.address();
const port = 3000;
const hostname = os.hostname();

var app = express();
app.enable('trust proxy');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});

var producer = new kafka.Producer(
  client,
  [{
    requireAcks: 1,
    ackTimeoutMs: 100,
	}]
);

producer.on('ready', function () {
	
	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	})

	app.post('/produce', function (req, res) {
		var timestamp = Date.now();

		var payload = JSON.stringify({"timestamp": Date.now(), "node": hostname, "msg": req.body.msg});

		producer.send(
		[
			{ topic: hostname, messages: payload },
			{ topic: 'global', messages: payload }
		],
		function (err, data) {
		});

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(payload);
	})

	app.listen(port, function () {
		console.log(`Productor corriendo en http://${host}:${port}`);
	})
});

producer.on('error', function (err) {
	console.log('error', err)
})


