<<<<<<< HEAD
const fs = require("fs");
const path = require("path");

const FILES_DIR = path.join(__dirname, "files");

// LIST FILES
function listFiles(socket) {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            socket.write("Error reading directory");
            return;
        }
        socket.write("FILES:\n" + files.join("\n"));
    });
}

// READ FILE
function readFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            socket.write("File not found");
            return;
        }
        socket.write("CONTENT:\n" + data);
    });
}

// DELETE FILE
function deleteFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            socket.write("Error deleting file");
            return;
        }
        socket.write("File deleted successfully");
    });
}

module.exports = {
    listFiles,
    readFile,
    deleteFile,
};
=======
const fs = require("fs");
const path = require("path");

const FILES_DIR = path.join(__dirname, "files");

// LIST FILES
function listFiles(socket) {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            socket.write("Gabim gjatë leximit të folderit");
            return;
        }
        socket.write("FILET NË SERVER:\n" + files.join("\n"));
    });
}

// READ FILE
function readFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            socket.write("File nuk u gjet");
            return;
        }
        socket.write("PËRMBAJTJA E FILE-IT:\n" + data);
    });
}

// DELETE FILE
function deleteFile(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            socket.write("Gabim gjatë fshirjes së file-it");
            return;
        }
        socket.write("File u fshi me sukses");
    });
}

// FILE INFO
function fileInfo(socket, filename) {
    const filePath = path.join(FILES_DIR, filename);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            socket.write("File nuk u gjet");
            return;
        }

        socket.write(
            `INFORMACIONI I FILE-IT:
Madhësia: ${stats.size} bytes
Krijuar: ${stats.birthtime}
Modifikuar: ${stats.mtime}`
        );
    });
}

// SEARCH FILES
function searchFile(socket, keyword) {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            socket.write("Gabim gjatë leximit të folderit");
            return;
        }

        const result = files.filter(file => file.includes(keyword));

        if (result.length === 0) {
            socket.write("Nuk u gjet asnjë file me këtë fjalë");
        } else {
            socket.write("REZULTATET E KËRKIMIT:\n" + result.join("\n"));
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

>>>>>>> 840672d (save local changes)
