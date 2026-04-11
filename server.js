const net = require('net');

const HOST = '127.0.0.1';
const PORT = 5000;

const server = net.createServer((socket) => {
    console.log('Klienti u lidh');
});

server.listen(PORT, HOST, () => {
    console.log(`Serveri eshte duke punu ne ${HOST}:${PORT}`);
});

