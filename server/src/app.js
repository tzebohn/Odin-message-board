import express from 'express';
import cors from 'cors'
import postRoutes from './routes/postRoutes.js'

const app = express()

//  Global middlewares
app.use(express.json()) // Parses JSON request bodies
app.use(cors())

app.use('/api/posts', postRoutes)   // ALL routes in postRoutes are prefixed with /api/posts

export default app