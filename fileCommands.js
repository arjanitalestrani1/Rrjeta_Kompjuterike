const fs = require("fs");
const path = require("path");

const FILES_DIR = path.join(__dirname, "files");

// LIST FILES
function listFiles(socket) {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            socket.write("Gabim gjatë leximit të folderit\n");
            return;
        }
        socket.write("FILET NË SERVER:\n" + files.join("\n") + "\n");
    });
}

// READ FILE
function readFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            socket.write("File nuk u gjet\n");
            return;
        }
        socket.write("PËRMBAJTJA E FILE-IT:\n" + data + "\n");
    });
}

// DELETE FILE
function deleteFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            socket.write("Gabim gjatë fshirjes së file-it\n");
            return;
        }
        socket.write("File u fshi me sukses\n");
    });
}

// FILE INFO
function fileInfo(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            socket.write("File nuk u gjet\n");
            return;
        }

        socket.write(
            `INFORMACIONI I FILE-IT:
Madhësia: ${stats.size} bytes
Krijuar: ${stats.birthtime}
Modifikuar: ${stats.mtime}\n`
        );
    });
}

// SEARCH FILES
function searchFile(socket, keyword) {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            socket.write("Gabim gjatë leximit të folderit\n");
            return;
        }

        const result = files.filter(file => file.includes(keyword));

        if (result.length === 0) {
            socket.write("Nuk u gjet asnjë file me këtë fjalë\n");
        } else {
            socket.write("REZULTATET E KËRKIMIT:\n" + result.join("\n") + "\n");
        }
    });
}

module.exports = {
    listFiles,
    readFile,
    deleteFile,
    fileInfo,
    searchFile
};