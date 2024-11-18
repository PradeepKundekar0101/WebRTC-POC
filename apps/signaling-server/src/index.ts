import express from "express"
import WebSocket from "ws"
import http from "http"
import { User } from "./services/User"
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({
    server
})
wss.on("connection",(ws)=>{
    console.log("New Connection")
    const user = new User(ws)
    user.initHandler()
})
const PORT = process.env.PORT || 8000
server.listen(PORT,()=>{
    console.log("Server running at PORT "+PORT)
})