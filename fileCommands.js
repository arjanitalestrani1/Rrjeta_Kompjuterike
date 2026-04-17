const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');

// nese folderi files nuk ekziston, krijoje
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// /list
function listFiles(socket) {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            socket.write('Gabim gjate leximit te folderit.\n');
            return;
        }

        if (files.length === 0) {
            socket.write('Nuk ka file ne server.\n');
            return;
        }

        socket.write('File ne server:\n' + files.join('\n') + '\n');
    });
}

// /read filename
function readFile(socket, filename) {
    const filePath = path.join(filesDir, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            socket.write('File nuk u gjet ose nuk mund te lexohet.\n');
            return;
        }

        socket.write(`Permbajtja e file-it ${filename}:\n${data}\n`);
    });
}

// /delete filename
function deleteFile(socket, filename) {
    const filePath = path.join(filesDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            socket.write('File nuk u gjet ose nuk mund te fshihet.\n');
            return;
        }

        socket.write(`File ${filename} u fshi me sukses.\n`);
    });
}

// /search keyword
function searchFiles(socket, keyword) {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            socket.write('Gabim gjate kerkimit.\n');
            return;
        }

        const matches = files.filter(file =>
            file.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matches.length === 0) {
            socket.write(`Asnje file nuk u gjet per fjalen kyce: ${keyword}\n`);
            return;
        }

        socket.write(`File te gjetura:\n${matches.join('\n')}\n`);
    });
}

// /info filename
function fileInfo(socket, filename) {
    const filePath = path.join(filesDir, filename);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            socket.write('File nuk u gjet.\n');
            return;
        }

        socket.write(
            `Informacion per ${filename}:\n` +
            `Madhesia: ${stats.size} bytes\n` +
            `Krijuar: ${stats.birthtime}\n` +
            `Modifikuar: ${stats.mtime}\n`
        );
    });
}

// /download filename
function downloadFile(socket, filename) {
    const filePath = path.join(filesDir, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            socket.write('File nuk u gjet per download.\n');
            return;
        }

        socket.write(`DOWNLOAD ${filename}\n${data}\n`);
    });
}

// /upload filename content
function uploadFile(socket, filename, content) {
    const filePath = path.join(filesDir, filename);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            socket.write('Gabim gjate upload-it te file-it.\n');
            return;
        }

        socket.write(`File ${filename} u ngarkua me sukses.\n`);
    });
}

module.exports = {
    listFiles,
    readFile,
    deleteFile,
    searchFiles,
    fileInfo,
    downloadFile,
    uploadFile 
};