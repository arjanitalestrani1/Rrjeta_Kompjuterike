const net = require('net');
const http = require('http');
const commands = require('./fileCommands');

const HOST = '127.0.0.1'; 
const PORT = 5000;
const HTTP_PORT = 8080;
const MAX_CLIENTS = 4;
const TIMEOUT = 15000;

let clients = [];
let messages = [];

function removeClient(clientId) {
    clients = clients.filter(c => c.id !== clientId);
}

const server = net.createServer((socket) => {
    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

    if (clients.length >= MAX_CLIENTS) {
        socket.write('Serveri eshte full.\n');
        socket.end();
        return;
    }

    const role = clients.length === 0 ? 'admin' : 'user';

    const clientObj = {
        id: clientId,
        role: role,
        connectedAt: new Date()
    };

    clients.push(clientObj);

    console.log(`Klienti u lidh: ${clientId} (${role})`);
    console.log(`Kliente aktiv: ${clients.length}`);

    socket.write(`Miresevini! Ju jeni: ${role}\n`);

    socket.setTimeout(TIMEOUT);

    socket.on('data', (data) => {
        const text = data.toString().trim();

        if (!text) {
            socket.write('Komande ose mesazh i pavlefshem.\n');
            return;
        }

        const [cmd, ...args] = text.split(' ');

     
        // ADMIN COMMANDS
     
        if ([
            '/list',
            '/read',
            '/upload',
            '/download',
            '/delete',
            '/info',
            '/search'
        ].includes(cmd)) {

            if (clientObj.role !== 'admin') {
                socket.write('Nuk keni leje per kete komande.\n');
                return;
            }

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

            else if (cmd === '/upload') {
                if (!args[0]) {
                    socket.write('Perdorimi: /upload emriFile permbajtja\n');
                } else {
                    const filename = args[0];
                    const content = args.slice(1).join(' ');

                    if (!content) {
                        socket.write('Gabim: mungon permbajtja e file-it per upload.\n');
                    } else {
                        commands.uploadFile(socket, filename, content);
                    }
                }
            }

            else if (cmd === '/download') {
                if (!args[0]) {
                    socket.write('Perdorimi: /download emriFile\n');
                } else {
                    commands.downloadFile(socket, args[0]);
                }
            }

            else if (cmd === '/delete') {
                if (!args[0]) {
                    socket.write('Perdorimi: /delete emriFile\n');
                } else {
                    commands.deleteFile(socket, args[0]);
                }
            }

            else if (cmd === '/info') {
                if (!args[0]) {
                    socket.write('Perdorimi: /info emriFile\n');
                } else {
                    commands.fileInfo(socket, args[0]);
                }
            }

            else if (cmd === '/search') {
                if (!args[0]) {
                    socket.write('Perdorimi: /search keyword\n');
                } else {
                    commands.searchFile(socket, args.join(' '));
                }
            }

            return;
        }

        
        // NORMAL MESSAGE
        
        const messageObject = {
            clientId: clientId,
            role: clientObj.role,
            message: text,
            time: new Date().toLocaleString()
        };

        messages.push(messageObject);

        console.log(`Mesazh nga ${clientId}: ${text}`);
        socket.write(`Serveri e pranoi mesazhin: ${text}\n`);
    });

    socket.on('timeout', () => {
        console.log(`Klienti ${clientId} u shkeput nga timeout.`);
        socket.write('Lidhja u mbyll per shkak te mosaktivitetit.\n');
        socket.end();
    });

    socket.on('end', () => {
        console.log(`Klienti doli: ${clientId}`);
    });

    socket.on('close', () => {
        removeClient(clientId);
        console.log(`Lidhja u mbyll: ${clientId}`);
        console.log(`Kliente aktiv: ${clients.length}`);
    });

    socket.on('error', (err) => {
        console.log(`Gabim nga ${clientId}: ${err.message}`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`TCP serveri eshte duke punu ne ${HOST}:${PORT}`);
});

// HTTP SERVER FOR /stats

http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            activeClients: clients.length,
            clientIPs: clients.map(c => c.id),
            totalMessages: messages.length,
            messages: messages
        }, null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(HTTP_PORT, () => {
    console.log(`HTTP serveri eshte aktiv ne portin ${HTTP_PORT}`);
});