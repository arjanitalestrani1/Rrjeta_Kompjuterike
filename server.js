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
