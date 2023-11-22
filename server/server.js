require('dotenv').config()
const { createServer } = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

const { Server } = require('socket.io')
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

function whileConnected(socket)
{
    console.log(`${socket.id} connected`)

    // Event for joining a new Chat room
    socket.on('join-room', (roomName, username) =>{
        socket.join(roomName)

        if(!currentConnections.has(roomName))
        {
            currentConnections.set(roomName, new Map())
        }

        currentConnections.get(roomName).set(username, socket.id)

        console.log(`User ${username} joined room: ${roomName}`)
        sendUserState(roomName, username, '!user-joined!')
        updateUsersInRoom(roomName)
    })
    
    socket.on('send-message', (data) => {
        const { room, message, sendTime } = data
        const username = getUsername(socket)
        io.to(room).emit('received-message', {username: username, message, sendTime: sendTime})
    })

    // Event will be fired if a socket disconnects
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
        const username = getUsername(socket)
       
        // Delete User from currentConnections and broadcast to other users
        for(const [room, users] of currentConnections.entries())
        {
            if(users.has(username))
            {
                sendUserState(room, username, '!user-disconnected!')
                users.delete(username)
                updateUsersInRoom(room)
            }
        }        
    })

}

// Helper function to get a Username via the socketID
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

// Helper functions
function updateUsersInRoom(room) {
    io.to(room).emit('update-connections', Array.from(currentConnections.get(room).entries()))
}

function sendUserState(room, username, message)
{
    io.to(room).emit('received-message', {username: username, message})
}