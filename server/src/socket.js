import { Server } from "socket.io"

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

let io = null   // Socket.IO server instance

/**
 * Creates a real-time event server that sits on top of the http server.
 * 
 * @param {HttpServer} server - The http server that wraps our Express server.
 */
export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id)

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id)
        })
    })
}

/**
 * Checks if socket server exists.
 * @returns - IO object if it exists. 
 *          - Otherwise throws error.
 */
export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }
    return io
}