const net = require('net');
const client = new net.Socket();
client.connect(9000, '127.0.0.1', function () {
});
client.on('data', (chunk) => {
    console.log('data', chunk.toString())
    //data Hi!
    //Bye!
});