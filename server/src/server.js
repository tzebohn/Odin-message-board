import app from "./app.js";
import { db } from "./db/db.js";

const PORT = 3000

//  Connect to database
db.then(() => {
    console.log('Connected to MySQL!')
    //  Start express server
    app.listen(PORT, () => {
        console.log(`Server running on port: http://localhost:${PORT}`)
    })
}).catch(err => {
    console.error('DB connection error:', err)
})
