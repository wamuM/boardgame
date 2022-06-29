async function connection (ws){
    let token;
    do{//generate token until the token is not being used by an OPEN socket
        token = await tokenGen.generate()       
    }while(sockets.get(token)?.readyState < WebSocket.CLOSED)
    ws.onclose = (ce)=>{
        sockets.delete(token)//removes socket from memory if the connection is closed
    }
    sockets.set(token,ws)
    ws.onmessage = (me)=>gameProcess(me,ws);
    ws.send("TOKEN\r\n"+token)
}

module.exports = {connection}