
import mongoose, { Schema } from "mongoose"

 const reviewSchema = new mongoose.Schema({


    movieId:{ type: Schema.Types.ObjectId, ref:"movie",required: true

    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"user", required:true
    },
    rating:{
       type: Number,
        required:true
    } ,

    comment:{
    type:String,
    maxlength: 200,
    required :true
    }


 },{
    timestamps:true
 })

 const reviewModel = mongoose.model("reviews", reviewSchema)

 export default reviewModel