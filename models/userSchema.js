import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique:true,
        minlength:3,
        maxlength:40
    },

    password:{
        type:String,
        minlength: 4,
        required:true
    },

    email:{
        type:String,
        required: true,
        unique:true,
        maxlength:100
    },

   role: {
    type:String,
    enum:["Admin" , "User", ],
    default:"User"
    },

    status:{
        type:String,
        enum:["active","pending","banned"],
        default:"pending"
    },
},{timestamps: true})

const userModel = mongoose.model('user',userSchema)

export default userModel