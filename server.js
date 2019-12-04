var express = require('express');
app = express();
server = require('http').createServer(app);
io =  require('socket.io').listen(server);
usernames = [];
server.listen(3000);
console.log("server is running");

app.get('/',function(req,res){
    res.sendFile(__dirname + '/view/index.html');

});

io.sockets.on('connection',function(socket){
    console.log('Socket is connected....');
    socket.on('new user',function(data,callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        }
        else
        {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            UpdateUsernames();
        }
        
    });
    function UpdateUsernames()
    {
        io.sockets.emit('usernames',usernames);
    }
    socket.on('send message',function(data){
        io.sockets.emit('new message',{msg: data, user: socket.username});
    });
    socket.on('disconnect',function(data){
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username),1);
        UpdateUsernames();
    });
});