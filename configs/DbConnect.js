import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
async function DbConnect (){

    const Database = mongoose.connection
    
    
    Database.on("error", (err) => {
        console.error("database connection error", err);
        process.exit(1)
    });
    
    
    Database.once("open",()=>{
        console.log("connected to Database MOVIE_REF")
    })
    await mongoose.connect(process.env.BASE_URL)
}

export default DbConnect;