const net = require('net');
const fs = require('fs');
const http = require('http');
const commands = require('./fileCommands');

const HOST = '0.0.0.0';
const PORT = 5000;
const PORT2 = 8080;
const MAX_CLIENTS = 10;
const TIMEOUT = 60000;

let clients = [];
let messages = [];
const startTime = new Date();

// ================= REMOVE CLIENT =================
const removeClient = (clientId) => {
    clients = clients.filter(c => c.id !== clientId);
};

// ================= TCP SERVER =================
const server = net.createServer((socket) => {
    const ip = socket.remoteAddress;
    const clientId = `${ip}:${socket.remotePort}`;

    if (clients.length >= MAX_CLIENTS) {
        socket.write('Serveri eshte full.\n');
        socket.end();
        return;
    }

    const clientObj = {
        id: clientId,
        ip,
        role: 'user',
        loginStep: null,
        connectedAt: new Date()
    };

    clients.push(clientObj);

    console.log(`Klienti u lidh: ${clientId} (${clientObj.role})`);
    console.log(`Kliente aktiv: ${clients.length}`);

    socket.write("Miresevini!\n");
    socket.write("Per login: /login admin ose /login user\n");

    socket.setTimeout(TIMEOUT);

    socket.on('data', (data) => {
        const text = data.toString().trim();
        const [cmd, ...args] = text.split(' ');

        // ================= PASSWORD =================
        if (clientObj.loginStep === 'awaitingPassword') {
            if (text === '1234') {
                clientObj.role = 'admin';
                socket.write("U kyçët si ADMIN.\n");
            } else {
                socket.write("Password gabim.\n");
            }
            clientObj.loginStep = null;
            return;
        }

        // ================= LOGIN =================
        if (cmd === '/login') {
            if (args[0] === 'admin') {
                socket.write("Shkruani password:\n");
                clientObj.loginStep = 'awaitingPassword';
            } else if (args[0] === 'user') {
                clientObj.role = 'user';
                socket.write("U kyçët si USER.\n");
            } else {
                socket.write("Perdorimi: /login admin ose /login user\n");
            }
            return;
        }

        // ================= COMMANDS =================
        if (['/list', '/read', '/delete', '/info', '/search', '/download', '/upload'].includes(cmd)) {

            console.log(`Komande nga ${clientId} (${clientObj.role}): ${text}`);

            messages.push({
                clientId,
                role: clientObj.role,
                type: 'command',
                message: text,
                time: new Date().toLocaleString()
            });

            if (clientObj.role !== 'admin' && cmd !== '/read') {
                socket.write("Refuzuar: Keni vetem akses read (/read).\n");
                return;
            }

            const respond = (msg) => {
                if (clientObj.role === 'admin') {
                    socket.write(msg);
                } else {
                    setTimeout(() => {
                        try { socket.write(msg); } catch {}
                    }, 1000);
                }
            };

            const socketProxy = {
                write: (msg) => respond(msg)
            };

            if (cmd === '/list') commands.listFiles(socketProxy);
            else if (cmd === '/read') {
                if (!args[0]) socketProxy.write('Perdorimi: /read emriFile\n');
                else commands.readFile(socketProxy, args[0]);
            }
            else if (cmd === '/delete') {
                if (!args[0]) socketProxy.write('Perdorimi: /delete emriFile\n');
                else commands.deleteFile(socketProxy, args[0]);
            }
            else if (cmd === '/info') {
                if (!args[0]) socketProxy.write('Perdorimi: /info emriFile\n');
                else commands.fileInfo(socketProxy, args[0]);
            }
            else if (cmd === '/search') {
                if (!args[0]) socketProxy.write('Perdorimi: /search keyword\n');
                else commands.searchFiles(socketProxy, args[0]);
            }
            else if (cmd === '/download') {
                if (!args[0]) socketProxy.write('Perdorimi: /download emriFile\n');
                else commands.downloadFile(socketProxy, args[0]);
            }
            else if (cmd === '/upload') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /upload <filename>\n');
                } else {
                    const filename = args[0];
                    const content = args.slice(1).join(' ') || '';
                    commands.uploadFile(socketProxy, filename, content);
                }
            }
        }

        // ================= NORMAL MESSAGES =================
        else {
            const messageObject = {
                clientId,
                role: clientObj.role,
                type: 'message',
                message: text,
                time: new Date().toLocaleString()
            };

            messages.push(messageObject);

            fs.appendFileSync(
                'logs/message.log',
                `[${messageObject.time}] (${clientObj.role}) ${clientObj.ip}:${socket.remotePort}: ${messageObject.message}\n`
            );

            console.log(`Mesazh nga ${clientId} (${clientObj.role}): ${text}`);

            socket.write(`Serveri e pranoi mesazhin: ${text}\n`);
        }
    });

    socket.on('timeout', () => {
        console.log(`Timeout: ${clientId}`);
        socket.end();
    });

    socket.on('end', () => removeClient(clientId));
    socket.on('close', () => removeClient(clientId));
    socket.on('error', (err) => console.log(`Gabim: ${err.message}`));
});

server.listen(PORT, HOST, () => {
    console.log(`TCP server running on ${HOST}:${PORT}`);
});

// ================= HTTP SERVER =================
http.createServer((req, res) => {
    if (req.url === '/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            activeClients: clients.length,
            maxClients: MAX_CLIENTS,
            clientIPs: clients.map(c => c.ip),
            roles: clients.map(c => ({ ip: c.ip, role: c.role })),
            totalMessages: messages.length,
            uptime: `${Math.floor((Date.now() - startTime) / 1000)} seconds`,
            messages
        }, null, 2));
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
}).listen(PORT2, () => {
    console.log(`HTTP server running on port ${PORT2}`);
});