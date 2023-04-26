import { colors } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function Chat() {
    const socket = io('http://192.168.1.120:4000')
    const [isConnected, SetIsConnected] = useState(socket.connected)
    const [msg, setMsg] = useState([])
    const [val, setVal] = useState('')

    useEffect(() => {
        function onConnect() {
            SetIsConnected(true)
        }
        function onSendMsg(value) {
            setMsg(prev => [...prev, value])
        }
        socket.on('connect', onConnect)
        socket.on('chat', onSendMsg)

        return () => {
            socket.off("connect", onConnect)
            socket.off("chat", onSendMsg)
        }
    }, [msg])
    const sendChat = (e) => {
        e.preventDefault()
        socket.timeout(5000).emit("chat", "Jahnavi>" + val, () => { })
    }
    console.log("Status", isConnected)
    if (isConnected) {
        return (<>
            Status: Online <br></br>
            <input value={val} onChange={e => setVal(e.target.value)}></input>
            <button onClick={sendChat}>Send</button><br></br>
            {msg.map(val => <div>{val}</div>)}


        </>)

    }
    else {
        return (
            <>
                Status:Offline
            </>
        )
    }
}
export default Chat;