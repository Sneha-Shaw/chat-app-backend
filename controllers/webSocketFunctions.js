
import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { sendMessage } from "./messageControllers.js"

const webSocketFunctions = (server) => {

    // Websocket Server
    const wss = new WebSocketServer({ server })


    // I'm maintaining all active connections in this object
    const clients = {};
    // I'm maintaining all active users in this object
    const users = {};
    // User activity history.
    let userActivity = [];

    // A new client connection request received
    wss.on('connection', function (connection) {
        // Generate a unique code for every user
        const userId = uuidv4();
        console.log('Recieved a new connection');

        // Store the new connection and handle messages
        clients[userId] = connection;
        console.log(`${userId} connected.`);
        // send userid to client
        clients[userId].send(JSON.stringify({
            type: "userId",
            userId
        }));

        connection.on('message', (message) => handleMessage(message, userId));
        // User disconnected
        connection.on('close', () => handleDisconnect(userId));
    });


    // Handle messages from users
    function handleMessage(message, userId) {

        const data = JSON.parse(message);
        const messageType = data.type;
        console.log(messageType);
        switch (messageType) {
            case "user":
                users[userId] = data;
                userActivity.push(`${data.name} joined to chat`);
                sendToAll({
                    type: "user",
                    users,
                    userActivity
                });
                break;
            case "message":
                userActivity.push(`${users[userId]}: ${data.message}`);
                sendToAll({
                    type: "message",
                    ...data
                });
                break;
            default:
                break;
        }
    }

    // Send message to all users
    function sendToAll(data) {
        console.log(userActivity);
        // Save message to database
        if (data.type === "message") {

            sendMessage(data).then((response) => {

                if (response.success) {
                    Object.keys(clients).forEach((client) => {
                        console.log(response.data,"hii");
                        clients[client].send(JSON.stringify({ type: "message", data:response.data }));

                    });
                }
            }).catch((error) => {
                console.log(error);
            })

        }
        else {
            Object.keys(clients).forEach((client) => {

                clients[client].send(JSON.stringify(data));
            });
        }

    }

    // Handle disconnecting users
    function handleDisconnect(userId) {
        userActivity.push(`${users[userId]?.name} left the chat`);
        delete clients[userId];
        delete users[userId];
        sendToAll({
            type: "user",
            users,
            userActivity
        });
    }
}

export default webSocketFunctions