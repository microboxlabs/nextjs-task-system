import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });

    socket.on('input-change', (msg) => {
      socket.broadcast.emit('update-input', msg);
    });
  });

  server.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${process.env.PORT}`);
  });
});
