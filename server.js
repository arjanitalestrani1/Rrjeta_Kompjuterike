const net = require('net');
const commands = require('./fileCommands');

const HOST = '127.0.0.1';
const PORT = 5000;
const MAX_CLIENTS = 4;
const TIMEOUT = 15000;

let clients = [];
let messages = [];

const removeClient = (clientId) => {
    clients = clients.filter(c => c.id !== clientId);
};

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

    socket.setTimeout(TIMEOUT);

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

    socket.on('timeout', () => {
        console.log(`Klienti ${clientId} u shkeput nga timeout.`);
        const [cmd, ...args] = text.split(' ');

        if (cmd === '/list') {
            commands.listFiles(socket);
        } 
else if (cmd === '/read') {
            if (!args[0]) {
                socket.write('Perdorimi: /read emriFile\n');
            } else {
                commands.readFile(socket, args[0]);
            }
        } 
        else if (cmd === '/delete') {
            if (!args[0]) {
                socket.write('Perdorimi: /delete emriFile\n');
            } else {
                commands.deleteFile(socket, args[0]);
            }
        } 
        else {
            const messageObject = {
                clientId: clientId,
                message: text,
            time: new Date().toLocaleString()
            };

            messages.push(messageObject);

            console.log(`Mesazh nga ${clientId}: ${text}`);
            socket.write(`Serveri e pranoi mesazhin: ${text}\n`);
        }
    });

    socket.on('timeout', () => {
        console.log(`Klienti ${clientId} u shkep nga timeout.`);
        socket.end();
    });

    socket.on('end', () => {
        console.log(`Klienti doli: ${clientId}`);
        removeClient(clientId);
        console.log(`Kliente aktiv: ${clients.length}`);
    });

    socket.on('close', () => {
        removeClient(clientId);
    });

    socket.on('error', (err) => {
        console.log(`Gabim nga ${clientId}: ${err.message}`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Serveri eshte duke punu ne ${HOST}:${PORT}`);
});

const http = require('http');
const PORT2 = 8080;

http.createServer((req, res) => {
    if (req.url === '/stats') {
        res.writeHead(200, {'Content-Type': 'application/json'});

        res.end(
            JSON.stringify({
            activeClients: clients.length,
            clientIPs: clients.map(c => c.id),
            totalMessages: messages.length,
            messages: messages
            }, null, 2));
    
    }
    else {
        res.writeHead(404);
        res.end("Not Found");
    }
}).listen(PORT2, () => {
    console.log(`HTTP serveri eshte aktiv dhe duke funksionuar ne portin ${PORT2}`);
});