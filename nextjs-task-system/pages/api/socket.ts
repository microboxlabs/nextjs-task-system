import { Server } from 'socket.io';
import { Request } from "express";

const SocketHandler = (req: Request, res:any) => {
  if (res.socket.server.io) {
    console.log('Socket ya está corriendo');
  } else {
    console.log('Inicializando Socket...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Cliente conectado');

      // Escuchar cambios de input y emitir a otros clientes
      socket.on('input-change', (msg) => {
        socket.broadcast.emit('update-input', msg);
      });

      // Escuchar desconexión de un cliente
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });
  }
  res.end();
};

export default SocketHandler;
