const net = require('net');
const commands = require('./fileCommands');

const HOST = '127.0.0.1';
const PORT = 5000;
const MAX_CLIENTS = 4;
const TIMEOUT = 15000;

let clients = [];
let messages = [];
const knownIPs = {}; // Mban mend rolet e IP-ve per auto-recovery

const removeClient = (clientId) => {
    clients = clients.filter(c => c.id !== clientId);
};

const server = net.createServer((socket) => {
    const ip = socket.remoteAddress;
    const clientId = `${ip}:${socket.remotePort}`;

    if (clients.length >= MAX_CLIENTS) {
        socket.write('Serveri eshte full.\n');
        socket.end();
        return;
    }

    let role = 'user';
    if (!knownIPs[ip]) {
        // Kontrollojme nese ka ndonje admin ekzistues ne te gjithe regjistrin
        const adminExists = Object.values(knownIPs).includes('admin');
        if (!adminExists) {
            role = 'admin';
        }
        knownIPs[ip] = role;
    } else {
        role = knownIPs[ip]; // Rikupero rolin automatikisht (Pika 5)
    }

    const clientObj = {
        id: clientId,
        ip: ip,
        role: role,
        connectedAt: new Date()
    };
    clients.push(clientObj);

    console.log(`Klienti u lidh: ${clientId}(${role})`);
    console.log(`Kliente aktiv: ${clients.length}`);

    socket.write(`Miresevini! Ju jeni: ${role}\n`);

    socket.setTimeout(TIMEOUT);

    socket.on('data', (data) => {
        const text = data.toString().trim();
        const [cmd, ...args] = text.split(' ');

        if (['/list', '/read', '/delete', '/info', '/search', '/download', '/upload'].includes(cmd)) {

            // Vetëm admini ka të drejtë për fshirje dhe ngarkim të file-ave
            if (['/delete', '/upload'].includes(cmd) && clientObj.role !== 'admin') {
                socket.write("Refuzuar: Keni vetem akses leximi (Read-Only).\n");
                return;
            }

            // Kemi shtuar një funksion përgjigjeje për të shtuar vonesën e kërkuar nga pika 10
            const respond = (msg) => {
                if (clientObj.role === 'admin') {
                    socket.write(msg);
                } else {
                    setTimeout(() => {
                        try { socket.write(msg); } catch(e) {}
                    }, 1000); 
                }
            };

            // Krijo nje "proxy" socket per te detyruar perdorimin e funksionit 'respond' ashtu si kerkohet nga delay ne piken 10
            const socketProxy = {
                write: (msg) => respond(msg)
            };

            if (cmd === '/list') {
                commands.listFiles(socketProxy);
            }
            else if (cmd === '/read') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /read emriFile\n');
                } else {
                    commands.readFile(socketProxy, args[0]);
                }
            }
            else if (cmd === '/delete') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /delete emriFile\n');
                } else {
                    commands.deleteFile(socketProxy, args[0]);
                }
            }
            else if (cmd === '/info') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /info emriFile\n');
                } else {
                    commands.fileInfo(socketProxy, args[0]);
                }
            }
            else if (cmd === '/search') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /search keyword\n');
                } else {
                    commands.searchFiles(socketProxy, args[0]);
                }
            }
            else if (cmd === '/download') {
                if (!args[0]) {
                    socketProxy.write('Perdorimi: /download emriFile\n');
                } else {
                    commands.downloadFile(socketProxy, args[0]);
                }
            }
            else if (cmd === '/upload') {
                if (args.length < 2) {
                    socketProxy.write('Perdorimi: /upload <emriFile> <permbajtja e file>\n');
                } else {
                    const filename = args[0];
                    const content = args.slice(1).join(' ');
                    commands.uploadFile(socketProxy, filename, content);
                }
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
        console.log(`Klienti ${clientId} u shkeput nga timeout (Pika 5).`);
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
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(
            JSON.stringify({
                activeClients: clients.length,
                clientIPs: clients.map(c => c.ip),
                totalMessages: messages.length,
                messages: messages
            }, null, 2));
    }
    else {
        res.writeHead(404);
        res.end("Not Found");
    }
}).listen(PORT2, () => {
    console.log(`HTTP serveri eshte aktiv ne portin ${PORT2}`);
});