import http from "http"
import app from "./app.js";
import { db } from "./db/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 3000

//  Connect to database
db.query('SELECT 1')
    .then(() => {
        console.log('Connected to MySQL!')

        // Wrap Express inside http
        const server = http.createServer(app)

        // Attach WebSocket server
        initSocket(server)

        // Start server
        server.listen(PORT, () => {
            console.log(`Server running on port: http://localhost:${PORT}`)
        })
    })
    .catch(err => {
        console.error('DB connection error:', err)
    })
