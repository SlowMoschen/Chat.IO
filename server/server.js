require('dotenv').config()
const { createServer, get } = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

const { Server } = require('socket.io')
const { fchown } = require('fs')
const PORT = process.env.PORT
const httpServer = createServer(app)
httpServer.listen(PORT, () => console.log(`Server listening on Port http://localhost:${PORT}`))

// Middleware
app.use(express.json())

const corsOptions = {
    origin: true,
    credentials: true,
}
app.use(cors(corsOptions))

// Route Setups 
app.get('/', async (req, res) => {
    res.send('Server Running')
})

// POST Route - to authenticate if username is already taken
app.post('/', (req, res) => {

    const { username, room } = req.body

    if(currentConnections.get(room) === undefined || !currentConnections.get(room).has(username))
    {
        res.status(200).json(false)
        return
    }

    res.status(400).json(true)

})

// Socket.IO Setup
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http:localhost'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', whileConnected)

let currentConnections = new Map()
let typingUser = new Map()

function whileConnected(socket)
{
    console.log(`${socket.id} connected`)

    socket.on('join-room', (roomName, username) => joinRoom('new', roomName, socket, username))

    socket.on('join-new-room', (newRoom) => joinRoom( 'exist', newRoom, socket))
    
    socket.on('send-message', (data) => sendMessage(socket, data))
    
    socket.on('send-direct-message', (data) => sendDirectMessage(socket, data))

    socket.on('disconnect', () => disconnect(socket))

    socket.on('start-typing', () => startTyping(socket))

    socket.on('stoped-typing', () => stopTyping(socket))
}

// Socket Event Functions
function disconnect(socket)
{
    console.log(`${socket.id} disconnected`)
    const username = getUsername(socket)
    deleteUser(username)
}

function sendMessage(socket, data)
{
    const { room, message, sendTime } = data
    const username = getUsername(socket)
    io.to(room).emit('received-message', {username: username, message, sendTime: sendTime, room: room, dm: false})
}

function sendDirectMessage(socket, data)
{
    const { reciever, message, sendTime, room } = data
    
    const senderUsername = getUsername(socket)
    const recieverSocketID = getSocketID(reciever, room)
    const senderSocketID = getSocketID(senderUsername, room)

    io.to(senderSocketID).emit('recieved-direct-message', {sender: senderUsername, message, sendTime: sendTime, dm: true})
    io.to(recieverSocketID).emit('recieved-direct-message', {sender: senderUsername, message, sendTime: sendTime, dm: true})
}

function joinRoom(userType, roomName, socket, username)
{
    if(!username)
    {
        username = getUsername(socket)
    }
    const currentRoom = getCurrentRoom(socket)
    
    if(currentRoom && currentRoom !== roomName && userType !== 'new')
    {
        
        deleteUser(username, currentRoom)
        updateUsersInRoom(currentRoom)
        socket.leave(currentRoom)
    }
    
    socket.join(roomName)
    
    if(!currentConnections.has(roomName))
    {
        currentConnections.set(roomName, new Map())
        typingUser.set(roomName, new Map())
        console.log(typingUser);
    }
    
    currentConnections.get(roomName).set(username.toLowerCase(), socket.id)
    console.log(currentConnections);
    sendUserState(roomName, username, '!user-joined!')
    updateUsersInRoom(roomName)
    console.log(`User ${username} joined room: ${roomName}`);
}

function startTyping(socket)
{
    const username = getUsername(socket)
    const currentRoom = getCurrentRoom(socket)
    
    typingUser.get(currentRoom).set(socket.id, username)

    socket.to(currentRoom).emit('user-started-typing', { username })

}

function stopTyping(socket)
{
    const username = getUsername(socket)
    const currentRoom = getCurrentRoom(socket)

    typingUser.get(currentRoom).delete(socket.id)

    socket.to(currentRoom).emit('user-stoped-typing', { username })
}

// Helper functions
function getUsername(socket)
{
    let output
    currentConnections.forEach((roomName) => {
        roomName.forEach((userID, username) => {
            if(socket.id === userID)
            {
                output = username
            }
        })
    })
    return output
}

function getSocketID(username, room)
{
    return currentConnections.get(room).get(username)
}

function getCurrentRoom(socket)
{
    for(const room of currentConnections.entries())
    {
        for(const users of room[1].entries())
        {
            if(users[1] === socket.id)
            {
                return room[0]
            }
        }
    }
}

// Delete User from currentConnections and broadcast to other users
function deleteUser(username, currentRoom)
{
    if(currentRoom)
    {
        currentConnections.get(currentRoom).delete(username)
        sendUserState(currentRoom, username, '!user-disconnected!')
        updateUsersInRoom(currentRoom)
    }
    else 
    {

        for(const [room, users] of currentConnections.entries())
        {
            if(users.has(username))
            {
                sendUserState(room, username, '!user-disconnected!')
                users.delete(username)
                updateUsersInRoom(room)
            }
        }        
    }
}

function updateUsersInRoom(room) {
    io.to(room).emit('update-connections', Array.from(currentConnections.get(room).entries()))
}

function sendUserState(room, username, message)
{
    io.to(room).emit('received-message', {username: username, message, room: room})
}