const net = require('net');
const readline = require('readline');

const HOST = '127.0.0.1';
const PORT = 5000;

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

client.connect(PORT, HOST, () => {
    console.log('U lidh me serverin');
    console.log('Shkruaj mesazh ose komandë (/list, /read file.txt, /delete file.txt, /exit)');
    rl.prompt();
});

client.on('data', (data) => {
    console.log(`\n Serveri: ${data.toString()}`);
    rl.prompt();
});

client.on('close', () => {
    console.log(' U shkëpute nga serveri');
    process.exit(0);
});

client.on('error', (err) => {
    console.log(` Gabim: ${err.message}`);
});

rl.on('line', (input) => {
    const text = input.trim();

    if (!text) {
        rl.prompt();
        return;
    }

    if (text === '/exit') {
        console.log('Duke u shkëputur...');
        client.end();
        rl.close();
        return;
    }

    client.write(text);
});

rl.on('close', () => {
    console.log('Klienti u mbyll');
    process.exit(0);
});
