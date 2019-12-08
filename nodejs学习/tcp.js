const net = require('net')

const server = net.createServer((socket) => {
    socket.on('data', () => {
        socket.write('你好')
    })
    socket.on('end', () => {
        console.log("断开连接")
    })
    socket.listen(9100, () => {
        console.log('server bound');
    })
})


