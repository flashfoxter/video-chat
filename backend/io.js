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
            socket.in(getRoom(socket)).emit("get-offer", offer);
        });

        socket.on("send-answer", (answer) => {
            socket.in(getRoom(socket)).emit("get-answer", answer);
        });

        socket.on("send-candidate", (candidate) => {
            socket.in(getRoom(socket)).emit("get-candidate", candidate);
        });

        socket.on("connection-established", () => {
            io.in(getRoom(socket)).emit("ready");
        });

        socket.on("disconnecting", () => {
            socket.in(getRoom(socket)).emit("someone-left");
        });
    });

    function getRoom(socket) {
        return Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
    }
};