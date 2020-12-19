**📝 Table of Contents**

[TOC]

# Primeros pasos

Instalaciones

[Socket.io](https://www.npmjs.com/package/socket.io 'Socket.io')

`npm i socket.io`

`npm i express`

```javascript
//servidor de express
const app = require('express')();

//servidor de sockest
const server = require('http').createServer(app);

//configuracion de socket server
const io = require('socket.io')(server);
io.on('connection', () => {
	console.log('cliente conectado');
});

server.listen(8080, () => {
	console.log('Server corriendo en puerto :8080');
});
```

```json
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"dev": "nodemon index.js",
		"start": "node index.js"
	},
```

para iniciar servidor parte de los scripts

`npm run dev, npm run start`

# Fronted MiniChat

```javascript
//servidor de express
const express = require('express');
const app = express();

//desplegar el directoriio publico
app.use(express.static(__dirname + '/public'));
```

creamos nuestro public en la raiz del proyecto y el body ponemos el scritp del sockect.io desde el cdn y** el siguiente codigo**

[cdn](https://cdnjs.com/libraries/socket.io 'cdn')

```html
<body>
	<h1>Hola mundo</h1>

	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js"
		integrity="sha512-aMGMvNYu8Ue4G+fHa359jcPb1u+ytAF+P2SCb+PxrjCdO3n3ZTxJ30zuH39rimUggmTwmh2u7wvQsDTHESnmfQ=="
		crossorigin="anonymous"
	></script>

	<script>
		io('http://localhost:8080');
	</script>
</body>
```

# Recibir eventos

El id cambia a cada recorda la web
El socket emite eventos , el primer argumentos es el evento que se dispara y el segundo el payload

```javascript
io.on('connection', (socket) => {
	console.log(socket.id);
	socket.emit('mensaje-bienvenida', 'bienvenida al server');
	socket.emit('mensaje-bienvenida', {
		msg: 'Bienvenido al server',
		fecha: new Date(),
	});
});
```

En el html el script en lado del cliente

```javascript
	<script>
			const socket = io('http://localhost:8080');

			socket.on('mensaje-bienvenida', (data) => {
				console.log('El servidor emitio algo');
				console.log(data);
			});
	</script>
```

# Emitir eventos al servidor

El cliente lanzamos el evento luego de dos segundos

```javascript
setTimeout(() => {
	console.log('esto');

	socket.emit('mensage-cliente', {
		msg: 'cliente',
		nombre: 'Gabriel',
	});
}, 2000);
```

En la consola del servidor escuchamos el evento del cliente dela forma siguiente:

```javascript
socket.on('mensage-cliente', (data) => {
	console.log(data);
});
```

# Enviar y recibir mensajes desde y hacia el servidor

En el html es el scritp manejamos el dom para mostrar el chat en tiempo real

```javascript
	<script>
			const socket = io('http://localhost:8080');

			//referencia al html
			const formulario = document.querySelector('#miFormulario');
			const mensajes = document.querySelector('#misMensajes');
			const txtMensage = document.querySelector('#txtMensaje');

			formulario.addEventListener('submit', (e) => {
				e.preventDefault();

				const nuevoMensaje = txtMensage.value;

				socket.emit('mensaje-to-server', {
					texto: nuevoMensaje,
				});
			});

			socket.on('mensaje-from-client', (data) => {
				mensajes.innerHTML += `<li>${data.texto}</li>`;
			});
		</script>
```

el servidor mandamos la informacion y atravez de **io** hacemos que la informacion sea global para todos los clientes

```javascript
io.on('connection', (socket) => {
	socket.emit('mensaje-bienvenida', {
		msg: 'Bienvenido al server',
		fecha: new Date(),
	});

	socket.on('mensaje-to-server', (data) => {
		console.log(data);

		io.emit('mensaje-from-client', data);
	});
});
```

#Backend basado en clases

Crearemos una **archivo models en la raiz del proyecto** y llevaros nuestro server a una clase en un **archivo server.js**

```javascript
const express = require('express');
const http = require('http');
const sokectio = require('socket.io');
const path = require('path');

class Server {
	constructor() {
		this.app = express();
		this.port = 8080;

		//http server
		this.server = http.createServer(this.app);

		//configuraciones de sockets
		this.io = sokectio(this.server, {});
	}

	middlewares() {
		//desplegar el directorio publico
		this.app.use(express.static(path.resolve(__dirname, '../public')));
	}

	configurarSockets() {}

	execute() {
		//inicializamos middlewares
		this.middlewares();

		//Inicializar sockect

		//inicializar el server
		this.server.listen(this.port, () => {
			console.log('Server corriendo en puerto', this.port);
		});
	}
}

module.exports = {
	Server,
};
```

y el index de nuestro proyecto queda de la siguiente forma: **instanciando server y utulizando su metodo execute**

```javascript
const { Server } = require('./models/server');

const server = new Server();

server.execute();
```

# Configurar sockects en clase server

En models creamos la el archivo** sockects y hacemos una clase**

```javascript
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
```

y el server lo mandamos a llamar pasando el this.io y el **configurarSockect lo inicializamos en el execute()
**

```javascript
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
```

#Variables de entorno

Creamos un archivo **.env** y pones como variable de entono a :

`npm i dotenv`

`PORT = 8080`

en el index js mandamos a llamar a :

    require('dotenv').config();

```javascript
class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
```

# Desplegar en Heroku

Creamos nuestra cuenta en heroku y creamos nuestra app **create-app**

Luego instalamos el CLI

Luego en la terminal seguir estos comandos:

La pagina Heroku para los comandos [Heroku](https://dashboard.heroku.com/apps/remini-chat/deploy/heroku-git 'Heroku')

    	$ heroku login

abre el navegador web para la autenticacion

    	$ heroku git:remote -a remini-chat
    	$ git push heroku master

Open appLuego hacemos click en Open app

Ejecutamos el suguiente comando para saber en que puerto se esta ejecutando:

    	$ heroku logs -n 1000 --tail

Eso lo vemos gracias a que posimos un **clg en**

```javascript
	sockecttEnvent() {
		this.io.on('connection', (socket) => {
			//escuchamos evento: mensage-to-server
			socket.on('mensaje-to-server', (data) => {
				console.log(data);
				this.io.emit('mensaje-from-client', data);
			});
		});
	}
```

# Probar el socket server en produccion

Hacemos lo el cambio en el index html en el scrip cambiamos el puerto con la url donde esta deblegado nuetro mini-chat

```html
<script>
			const socket = io('https://remini-chat.herokuapp.com/');

			//referencia al html
```

Y listo la aplicacion funciona

# Habilitar Cors

Sólo hay algo que me hace falta configurar y ahora es necesario en la versión 3.0 o superior de socket

y o si y sólo si nosotros queremos que otros clientes se conecten a nuestro socket server.

Si no están en el mismo dominio y estamos hablando de un problema de Cours, entonces tenemos que habilitar cors en nuestro backend

    	$ npm i cors

models/server.js

```javascript
const cors = require('cors');

	middlewares() {
		//desplegar el directorio publico
		this.app.use(express.static(path.resolve(__dirname, '../public')));

		//CORS
		this.app.use(cors());
	}
```
