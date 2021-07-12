const express = require('express');
const path = require('path');

const multer = require('multer');
const multerConfig = require("./multer")

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const mongoose = require('mongoose');

// Configurando o mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/dbpjchat', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(()=>{
        console.log("MongoDB Conectado...");
    }).catch((err)=>{
        console.log("Houve um erro: " + err);
    });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post("/posts", multer(multerConfig).single("file"), (req, res) => {
    console.log(req.file);
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        console.log(data);
        socket.broadcast.emit('receivedMessage', data);
    });

});



server.listen(3000);