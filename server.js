socket.on('data', (data) => {
    const text = data.toString().trim();

    const [cmd, ...args] = text.split(" ");

    // KOMANDAT
    if (cmd === "/list") {
        commands.listFiles(socket);
    } 
    else if (cmd === "/read") {
        commands.readFile(socket, args[0]);
    } 
    else if (cmd === "/delete") {
        commands.deleteFile(socket, args[0]);
    } 
    else if (cmd === "/search") {
        commands.searchFile(socket, args[0]);
    } 
    else if (cmd === "/info") {
        commands.fileInfo(socket, args[0]);
    } 
    else {
        socket.write("Komandë e panjohur.\n");
    }

    console.log(`Mesazh nga ${socket.remoteAddress}:${socket.remotePort} -> ${text}`);
});
else if (cmd === "/upload") {
    const filename = args[0];
    const content = args.slice(1).join(" ");

    const filePath = path.join(__dirname, "files", filename);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            socket.write("Gabim gjatë ngarkimit të file-it.\n");
        } else {
            socket.write("File u ngarkua me sukses.\n");
        }
    });
}

else if (cmd === "/download") {
    const filePath = path.join(__dirname, "files", args[0]);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            socket.write("File nuk u gjet.\n");
        } else {
            socket.write(`Përmbajtja e file-it:\n${data}`);
        }
    });
}