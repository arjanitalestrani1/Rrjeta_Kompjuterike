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

    socket.write(`Miresevini! Ju jeni: ${role}\n`);

    socket.setTimeout(TIMEOUT);

    socket.on('data', (data) => {
        const text = data.toString().trim();

        if (!text) {
            socket.write('Komande ose mesazh i pavlefshem.\n');
            return;
        }

        const [cmd, ...args] = text.split(' ');

        const execute = () => {

            if (cmd === '/list') {
                return commands.listFiles(socket);
            }

            if (cmd === '/read') {
                if (!args[0]) {
                    socket.write('Perdorimi: /read filename\n');
                } else {
                    commands.readFile(socket, args[0]);
                }
                return;
            }

            if ([
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

                if (cmd === '/upload') {
                    const filename = args[0];
                    const content = args.slice(1).join(' ');

                    if (!filename || !content) {
                        socket.write('Perdorimi: /upload filename content\n');
                    } else {
                        commands.uploadFile(socket, filename, content);
                    }
                }

                else if (cmd === '/download') {
                    if (!args[0]) {
                        socket.write('Perdorimi: /download filename\n');
                    } else {
                        commands.downloadFile(socket, args[0]);
                    }
                }

                else if (cmd === '/delete') {
                    if (!args[0]) {
                        socket.write('Perdorimi: /delete filename\n');
                    } else {
                        commands.deleteFile(socket, args[0]);
                    }
                }

                else if (cmd === '/info') {
                    if (!args[0]) {
                        socket.write('Perdorimi: /info filename\n');
                    } else {
                        commands.fileInfo(socket, args[0]);
                    }
                }

                else if (cmd === '/search') {
                    if (!args[0]) {
                        socket.write('Perdorimi: /search keyword\n');
                    } else {
                        commands.searchFiles(socket, args.join(' '));
                    }
                }

                return;
            }

            const messageObject = {
                clientId: clientId,
                role: clientObj.role,
                message: text,
                time: new Date().toLocaleString()
            };

            messages.push(messageObject);

            socket.write(`Serveri e pranoi mesazhin: ${text}\n`);
        };

        if (clientObj.role === 'admin') {
            execute();
        } else {
            setTimeout(execute, 2000);
        }
    });

    socket.on('timeout', () => {
        socket.write('Lidhja u mbyll per shkak te mosaktivitetit.\n');
        socket.end();
    });

    socket.on('close', () => {
        removeClient(clientId);
    });

    socket.on('error', () => {});
});

server.listen(PORT, HOST);

http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            activeClients: clients.length,
            clientIPs: clients.map(c => c.id),
            totalMessages: messages.length,
            messages: messages
        }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}).listen(HTTP_PORT);