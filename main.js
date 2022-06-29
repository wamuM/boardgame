const express = require("express");
const app = express();
const PORT = 8080;

// HTTP
app.use("/src/",express.static(__dirname+"/client/src/"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/client/index.html")
});


app.use((req,res,next)=>{
    res.sendFile(__dirname+"/client/404.html")
})
const server = app.listen(PORT,()=>console.log(`Listening at http://localhost:${PORT}`))

//WS
const WebSocket = require("ws");
const url = require("url")

const gameWs = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname.split("/");
    if(pathname[0] != "ws")socket.destroy();
    switch(pathname[1]){
        case "game":
            {gameWs.handleUpgrade(request,socket,head,(ws)=>gameWs.emit("connection", ws, request))}
        break;
        default:
            {socket.destroy();}
        break;
    }
});
// Adding listeners
const gameWSListeners = require(__dirname+"/server/gameWS.js");
Object.keys(gameWSListeners).forEach(key=>{
    gameWs.addListener(key,gameWSListeners[key]);
})


