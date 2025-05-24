import express from "express"
import movieModel from "../../models/movieschema.js"
import userModel from "../../models/userSchema.js"
import reviewModel from "../../models/reviewSchema.js"
import authUser from "../../middlewares/authUser.js"
const router = express.Router()
import adminAuth from "../../middlewares/adminAuth.js"
import movieValidator from "../../Validator/movieValidator.js"

router.get("/", authUser, async (req ,res)=>{
try {
    const findMovie = await movieModel.find()

    if(!findMovie){
        return res.status(400).json({message:"There is no movies to display"})
    }

    return res.status(200).json({message:"here are all the listed movies", findMovie})
    
} catch (error) {
    return res.status(500).json({message:"server or database error", error:error.message})
    
}
})




router.post("/",movieValidator, authUser,adminAuth, async (req,res) =>{
    const {title, director ,releseYear, gener } = req.body
    try {


        const findAnyCopy = await movieModel.findOne({title})
        
        if(findAnyCopy){
            return res.status(400).json({message: "That movie is already in the database"})
        }

        const newMovieInfo = new movieModel({title, director,releseYear,gener})

        await newMovieInfo.save()

        return res.status(201).json({message:`Movie was added to the list ${newMovieInfo.title}`})
    } catch (error) {
        return res.status(500).json({message:"SERVER O DATABASE ERROR", error:error.message})
    }
} )

router.get("/:_id",async (req, res)=>{
    const  {_id} = req.params
    if(!_id){
        return res.status(400).json({message:"There is no id Provided"})
    }

    try {
        const findMovie = await movieModel.findById({_id})

        if(!findMovie){
            return res.status(400).json({message:"there is no movie with this info"})
        }


        return res.status(200).json({message:`
            Title: ${findMovie.title}
            Director: ${findMovie.director} `})
    } catch (error) {
        return res.status(500).json({message:"DATABase or SERVER ERROR", error:error.message})
    }
})

router.put("/:_id" ,async (req,res)=>{

    try{

        const {title, director ,releseYear, gener } = req.body
        
        if(!title && !director && !releseYear && !gener){
            return res.status(400).json({message:"You need to provide atleast one this to change, title director reaslseYear or gener "})
        }
        
        const updatedData = {}
        if(title) updatedData.title = title
        if(director) updatedData.director = director
        if(releseYear) updatedData.releseYear=releseYear
        if(gener) updatedData.gener=gener
        
        const updateMovie = await movieModel.findByIdAndUpdate(
            req.params._id,
            updatedData
        )
        
        if(!updateMovie){
            return res.status(400).json({message:"No note with that id"})
        }
        
        res.status(201).json({sucess:true, message:`You have updated ${updateMovie}`})
        
    }catch(error){
        return res.status(500).json({message:"DataBase or server error", error:error.message})
    }
})

router.delete("/:_id", async (req,res)=>{
    const movieId = req.params._id
    if(!movieId){
        return res.status(400).json({message: "You have to provide an movieID"})
    }
    try {
        const deletedMovie = await movieModel.findByIdAndDelete(movieId)  

        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json({message:"you deleeted the mvoe from the dtatabase"})
    } catch (error) {
        res.status(500).json({message:"server or dtatbase error ", error:error.message})
    }
})

export default router