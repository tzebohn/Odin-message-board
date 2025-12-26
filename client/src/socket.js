import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export const socket = io(SOCKET_URL, {
    autoConnect: false  // Prevents React Strict Mode from connecting twice on mount
                        // Gives us explicit control
})