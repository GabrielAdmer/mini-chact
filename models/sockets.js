class Sockets {
	constructor(io) {
		this.io = io;
		this.sockecttEnvent();
	}

	sockecttEnvent() {
		this.io.on('connection', (socket) => {
			//escuchamos evento: mensage-to-server
			socket.on('mensaje-to-server', (data) => {
				console.log(data);
				this.io.emit('mensaje-from-client', data);
			});
		});
	}
}

module.exports = Sockets;
