import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
var corsOptions = {
  origin: process.env.WHITE_LIST,
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
app.use(express.static("public"))
app.use(cookieParser())





app.get('/', (req, res) => {
  res.send(`server is running .... `)
})

// routes
import userRouter from "./routes/user.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter)

import portfolioRouter from './routes/portfollio.routes.js';
app.use('/api/v2/portfolio', portfolioRouter)


export default app