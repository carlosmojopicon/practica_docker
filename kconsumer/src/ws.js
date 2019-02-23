const WebSocketServer = require('ws').Server;
const kafka = require('kafka-node');

const wss = new WebSocketServer({port: 3002});

const client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});

function kafkaReady() {
	return new Promise(function(resolve, reject) {
		client.loadMetadataForTopics(["global"], (err, resp) => {
			if ( 'undefined' !== typeof resp[1]['error'] ) {
				resolve(false);
			}
			else {
				resolve(true);
			}
		});
	});
}

function waitForKafka() {
	return new Promise(async function(resolve, reject) {
		var ready = false;
	
		do {
			ready = await kafkaReady();
		} while(!ready);
		
		resolve();
	});
}

waitForKafka().then(function() {

	// creamos el consumidor de kafka, y lo suscribimos al topic 'global'
	var consumer = new kafka.Consumer(
		client,
		[{
			topic: 'global',
			offset: 0,
			partition: 0
		}],
		{
			autoCommit: true
		}
	);
	
	// detecta conexión websocket con el cliente
	wss.on('connection', function (ws) {
		// se recibe un nuevo mensaje en el topic global
		consumer.on('message', function (message) {
			if (ws.readyState === ws.OPEN) {
				ws.send(message.value);
			}
		});
	});
});
