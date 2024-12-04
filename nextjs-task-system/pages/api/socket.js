import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket ya está corriendo');
  } else {
    console.log('Inicializando Socket...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Cliente conectado');

      socket.on('input-change', (msg) => {
        socket.broadcast.emit('update-input', msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
