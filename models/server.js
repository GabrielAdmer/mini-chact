const express = require('express');
const http = require('http');
const sokectio = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		//http server
		this.server = http.createServer(this.app);

		//configuraciones de sockets
		this.io = sokectio(this.server);
	}

	middlewares() {
		//desplegar el directorio publico
		this.app.use(express.static(path.resolve(__dirname, '../public')));
	}

	configurarSockets() {
		new Sockets(this.io);
	}

	execute() {
		//inicializamos middlewares
		this.middlewares();

		//Inicializar sockect
		this.configurarSockets();

		//inicializar el server
		this.server.listen(this.port, () => {
			console.log('Server corriendo en puerto', this.port);
		});
	}
}

module.exports = {
	Server,
};
