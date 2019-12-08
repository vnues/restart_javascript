const net = require('net');
const server = net.createServer();
server.on('connection', (client) => {
    client.write('Hi!\n'); // 服务端向客户端输出信息，使用 write() 方法
    client.write('Bye!\n');
    //client.end(); // 服务端结束该次会话
});
server.listen(9000);