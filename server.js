const express = require("express");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log("En användare anslöt");
});

app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public");

http.listen(8080, () => {
    console.log("server running")
});
