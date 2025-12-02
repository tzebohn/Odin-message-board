import app from "./app.js";

const PORT = 3000

//  Start express server
app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`)
})