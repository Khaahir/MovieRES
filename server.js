import express from "express"
import dotenv from "dotenv"
dotenv.config()
import DbConnect from "./configs/DbConnect.js"

import users from "./controllers/users/users.js"
import movies from "./controllers/movies/movies.js"
import review from "./controllers/reviews/reviews.js"

const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use("/users",users)
app.use("/movies",movies)
app.use("/reviews", review)

DbConnect().then(()=>{
    
    app.listen(PORT, ()=> {
    console.log(`Connect to Server at http://localhost:${PORT}`)
})


})