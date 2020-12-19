//desplegar el directoriio publico

const { Server } = require('./models/server');
//variables de entorno
require('dotenv').config();

const server = new Server();

server.execute();
