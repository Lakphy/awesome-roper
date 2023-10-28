import { useRef } from 'react';
import { Server } from 'socket.io';

const ioHandler = (req: any, res: any) => {
  const emitter = (global as any).emitter;

  console.log('Socket.io: 新用户接入');
  let wsRef = res.socket.server.io;

  if (!wsRef) {
    console.log('Socket.io: 初始化 WS 服务');
    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      //   socket.broadcast.emit('a user connected');
    });
    io.on('disconnect', (socket) => {
      //   socket.broadcast.emit('a user connected');
      emitter.removeAllListeners('onJump');
    });
    res.socket.server.io = io;
    wsRef = io;
  } else {
    wsRef = res.socket.server.io;
  }
  emitter.only('onJump', (arg: any) => {
    if (!wsRef) return;
    console.log('Socket.io: 发送跳绳消息');
    wsRef.emit('onJump', arg);
  });
  // setInterval(() => {
  //   wsRef.emit('onJump', Date.now());
  // }, 1234);

  res.end();
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default ioHandler;
