const net = require('net');

const HOST = '127.0.0.1';
const PORT = 5000;
const MAX_CLIENTS = 4;

let clients = [];
let messages = [];

const server = net.createServer((socket) => {
    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

    if (clients.length >= MAX_CLIENTS) {
        socket.write('Serveri eshte full.\n');
        socket.end();
        return;
    }

    clients.push({
        id: clientId,
        connectedAt: new Date()
    });

    console.log(`Klienti u lidh: ${clientId}`);
    console.log(`Kliente aktiv: ${clients.length}`);

    socket.on('data', (data) => {
        const text = data.toString().trim();

        const messageObject = {
            clientId: clientId,
            message: text,
            time: new Date().toLocaleString()
        };

        messages.push(messageObject);

        console.log(`Mesazh nga ${clientId}: ${text}`);
        socket.write(`Serveri e pranoi mesazhin: ${text}\n`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Serveri eshte duke punu ne ${HOST}:${PORT}`);
});