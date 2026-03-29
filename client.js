const net = require('net');

const client = net.createConnection({
    host: '127.0.0.1',
    port: 5000
}, () => {
    console.log('Connected to server');
    client.write('Hello server');
});

client.on('data', (data) => {
    console.log('Response:', data.toString());
});
