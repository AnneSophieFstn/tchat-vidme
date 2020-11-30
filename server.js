var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
let users = [];
let messages = [];
let index = 0;

io.on("connection", socket => {
    socket.emit('loggedIn', {
        users: users.map(s => s.username),
        messages: messages
    });

    socket.on('newuser', username => {
        console.log(`${username} à rejoint le tchat.`);
        socket.username = username;
        users.push(socket);

        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        message.push(message);

        io.emit('msg', message);

        index++;
    });

    // Deconnexion
    socket.on("disconnect", () => {
        console.log(`${socket.username} à quitter le tchat.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
})

http.listen(3010, () => {
    console.log(" Connecter sur le port %s", process.env.PORT || 3010);
});