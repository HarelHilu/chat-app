const express = require('express');
const socketio = require('socket.io');
const https = require('https');
const cors = require('cors');
const axios = require('axios');
var bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000;
const fs = require('fs');
const router = require('./router');

const app = express();
//const server = http.createServer(app);
const server = 
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: '123abc'
}, app)
const io = socketio(server);
//const https = require('https')

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use( express.json() );
app.use(bodyParser.json())

  app.post( '/', ( req, res ) => {
      console.log( 'received webhook: ' + JSON.stringify(req.body));
      res.sendStatus( 200 );
} ); 

app.get('/auth', ( req, res ) => {
    const data = JSON.stringify({
        "grant_type": "authorization_code",
        "client_id": "81f7fc67-9d97-4cf8-b298-a5572b5dc3d0",
        "client_secret": "0d8d58b4-a6ed-409f-a827-dad7b4192bbc",
        "code": req.query.code
    })
    const options = {
      hostname: '/https://www.wix.com',
      port: 443,
      path: '/oauth/access',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    
    //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    
    const httpsreq = https.request(options, res => {
    res.on('data', d => {
        console.log(d);
      })
      res.on('error', d => {
        console.log(d);
      })
    })

    httpsreq.write(data);
    httpsreq.end();
    res.sendStatus( 200 );

} ); 




io.on('connection', (socket) => {
    const users = [];
    const removeUser = (id) => {
        const inde = users.findIndex((user) => user.id === id);
    
        if(index !== -1) {
            return users.slice(index, 1)[0];
        }
    }
    const getUser = (id) => {
        return users.find((user) => user.id === id);
    }
    const usersInRoom = (room) => {
        users.filter((user) => user.room === room);
    }

    socket.on('join', ({name, room}) => {
        
        const user = {id: socket.id, name, room};
        users.push(user);

        socket.emit('message', { user: 'Budhha the Admin', text: user.name + " welcome to the room " + user.room});
        socket.broadcast.to(user.room).emit('message', { user: 'Budhha the Admin', text: user.name + ' has joined'});

        socket.join(user.room);
    });

    socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id);
            console.log(user);
            io.to(user.room).emit('message', {user: user.name, text:message});

            callback();
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected on server :(((((');
    })
});

app.use(router);

server.listen(PORT, () => console.log('Server has started on port ' + PORT));