const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const helmet = require("helmet");
require("./io")(io);

app.use(helmet());

http.listen(8081, () => {
    console.log("The server started successfully.");
});