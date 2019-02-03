module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.emit("request-room");

        socket.on("set-room", (room) => {
            io.in(room).clients((error, clients) => {
                if (!error) {
                    if (clients.length >= 2) {
                        socket.emit("kick");
                    }
                    else {
                        socket.join(room, () => {
                            socket.in(room).emit("new-connection");
                        });
                    }
                }
            });
        });

        socket.on("send-offer", (offer) => {
            const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
            socket.in(room).emit("get-offer", offer);
        });

        socket.on("send-answer", (answer) => {
            const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
            socket.in(room).emit("get-answer", answer);
        });

        socket.on("send-candidate", (candidate) => {
            const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
            socket.in(room).emit("get-candidate", candidate);
        });

        socket.on("connection-established", () => {
            const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
            io.in(room).emit("ready");
        });

        socket.on("disconnecting", () => {
            const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
            socket.in(room).emit("someone-left");
        });
    });
};