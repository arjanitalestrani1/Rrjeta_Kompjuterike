const net = require('net');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 5000;

let client;
let shouldReconnect = true;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

function connectToServer() {
    if (client) {
        client.removeAllListeners();
        client.destroy();
    }
    client = new net.Socket();
    
    client.connect(PORT, HOST, () => {
        console.log('U lidh me serverin');
        console.log('Shkruaj mesazh ose komandë (/list, /read emri, /delete emri, /upload emri, /download emri, /search fjalë, /info emri, /exit)');
        rl.prompt();
    });

    client.on('data', (data) => {
        const text = data.toString();
        
        // Handle download response saving
        if (text.startsWith('DOWNLOAD ')) {
            const lines = text.split('\n');
            const header = lines[0].split(' ');
            const filename = header[1];
            const content = lines.slice(1).join('\n');
            
            const downloadsDir = path.join(__dirname, 'client_downloads');
            if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
            
            fs.writeFileSync(path.join(downloadsDir, filename), content.replace(/\n$/, ''));
            console.log(`\n[Klienti] File ${filename} u shkarkua me sukses ne folderin "client_downloads".`);
            rl.prompt();
            return;
        }

        console.log(`\n Serveri: ${text}`);
        rl.prompt();
    });

    client.on('close', () => {
        if (shouldReconnect) {
            console.log('\n U shkëpute nga serveri. Po provohet rilidhja automatike (Auto-recovery) pas 3 sekondave...');
            setTimeout(connectToServer, 3000);
        } else {
            console.log(' Klienti u mbyll.');
            process.exit(0);
        }
    });

    client.on('error', (err) => {
        console.log(`\n Gabim i lidhjes: ${err.message}`);
    });
}

// Start connection
connectToServer();

rl.on('line', (input) => {
    const text = input.trim();

    if (!text) {
        rl.prompt();
        return;
    }

    const args = text.split(' ');
    const cmd = args[0];

    if (cmd === '/exit') {
        console.log('Duke u shkëputur...');
        shouldReconnect = false;
        if (client) client.end();
        rl.close();
        return;
    }

    if (cmd === '/upload' && args.length === 2) {
        const filename = args[1];
        const filePath = path.join(__dirname, filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            client.write(`/upload ${filename} ${content}`);
        } else {
            console.log(`\n[Klienti] File lokal nuk ekziston për tu ngarkuar me emrin: ${filename}`);
            rl.prompt();
        }
        return;
    }

    if (client && !client.destroyed) {
        client.write(text);
    } else {
        console.log("\n[Klienti] Nuk jeni i lidhur me serverin.");
    }
});

rl.on('close', () => {
    console.log('Klienti u mbyll.');
    process.exit(0);
});
