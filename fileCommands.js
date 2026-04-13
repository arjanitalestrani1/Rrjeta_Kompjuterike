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