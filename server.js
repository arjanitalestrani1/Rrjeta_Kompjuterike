const net = require('net');
<<<<<<< HEAD
=======
const commands = require('./fileCommands');
>>>>>>> c868966 (Updated server commands and client handling)

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
<<<<<<< HEAD

    if (clients.length >= MAX_CLIENTS) {
=======
if (clients.length >= MAX_CLIENTS) {
>>>>>>> c868966 (Updated server commands and client handling)
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
<<<<<<< HEAD

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
=======
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
>>>>>>> c868966 (Updated server commands and client handling)
        socket.end();
    });

    socket.on('end', () => {
        console.log(`Klienti doli: ${clientId}`);
        removeClient(clientId);
        console.log(`Kliente aktiv: ${clients.length}`);
<<<<<<< HEAD
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
=======
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
<<<<<<< HEAD
});






>>>>>>> c868966 (Updated server commands and client handling)
=======
    
>>>>>>> 70a9936 (Updated server commands and client handling)
