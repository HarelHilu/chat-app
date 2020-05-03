const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const https = require('https');

const router = require('./router');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use( express.json() );

io.on('connection', (socket) => {
    const users = [];

    socket.on('join', ({name, room}) => {
        
        const user = {id: socket.id, name, room};
        users.push(user);

        socket.emit('message', { user: 'Budhha the Admin', text: user.name + " welcome to the room " + user.room});
        socket.broadcast.to(user.room).emit('message', { user: 'Budhha the Admin', text: user.name + ' has joined'});

        socket.join(user.room);
    });

    socket.on('sendMessage', (message, callback) => {
            const user = users.find((user) => user.id === socket.id);
            io.to(user.room).emit('message', {user: user.name, text:message});

            callback();
    })
});

// app routes for wix
app.post( '/chatWebhook', ( req, res ) => {
  if (io != null && io.in('wix') != null) {
      io.in('wix').emit('message', { user: 'Budhha the Admin', text: 'message was sent in wix-chat. Go and check it out'});
  }
  
  res.sendStatus( 200 );
} ); 

// we send post to Wix in order to be authenticated and get the webhooks
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

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

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

app.use(router);
server.listen(PORT, () => console.log('Server has started on port ' + PORT));