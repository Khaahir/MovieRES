import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({

    title:{
        type: String,
        unique: true,
        required: true
    },

    director:{
        type:String,
        unique:true,
        required:true
    },
    
    releseYear:{
        type: Number,
        required:true
    },

    gener:{
        type:String,
        required:true
    }

})

const movieModel = mongoose.model("movie", movieSchema)
export default movieModel