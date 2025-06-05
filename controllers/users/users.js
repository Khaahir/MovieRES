import express from "express"
import userModel from "../../models/userSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import authUser from "../../middlewares/authUser.js"
import authAdmin from "../../middlewares/adminAuth.js"
import userValidator from "../../Validator/userValidator.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});


router.post("/signup", userValidator, async (req,res)=>{
 const{username, password ,email}= req.body
 try {
  
    const CheckUsername = await userModel.findOne({username})
    if(CheckUsername){
        return res.status(401).json({Message: "username is already taken try another one"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password, salt)

    const newuser  = new userModel({username , password:hashPass , email})

    await newuser.save()

     return res.status(201).json({sucess: true,
        message:`Welcome ${ newuser.username}  Let´s review some movies `
    })

 } catch (error) {
    res.status(500).json({message:"Something went wrong here",error:error.message})
 }

})


router.post("/login", async (req, res)=>{
const {username , password } = req.body

try {
    if(!username|| !password){
        return res.status(400).json({message: "Wrong Password or Username"})
    }

    const findUser = await userModel.findOne({username})
    if(!findUser){
        return res.status(400).json({message:"there is no user with that username or password"})
    }

    if(findUser.status === "pending"){
        await userModel.updateOne(
           { _id: findUser._id},
           {$set: {status: "active"}}
        )
    }

    if(findUser.status === "banned"){
        return res.status(400).json({Message:"This account is currently banned, contact support for more information"})
    }

    const checkpassword = await bcrypt.compare(password, findUser.password)

    if(!checkpassword){
        return res.status(400).json({ massage: "There is no user with that username or password"})
    }


    const token = jwt.sign(
        {id:findUser._id, username: username},
        process.env.SECRET_KEY,
        {expiresIn: "1h"}

)

    res.status(200).json({sucess:true,
        message:`Welcome back ${findUser.username 
        },
         token: ${token} ""`
    })

} catch (error) {
          console.error("🔥 SERVERFEL:", error); 
  res.status(500).json({
    message: "Server error",
    error: error.message, 
    stack: error.stack   
  });
}


})


router.post("/banuser/:_id",authUser,authAdmin,async (req,res)=>{
try {
    const findUser = await userModel.findById(req.params._id)

    if(!findUser){
        return res.status(400).json({message:"Could not find that id"})
    }

    findUser.status = "banned"
    await findUser.save()

    res.status(200).json(`this user is now banned ${findUser.username}`)

} catch (error) {
              console.error("🔥 SERVERFEL:", error); 
  res.status(500).json({
    message: "Server error",
    error: error.message, 
    stack: error.stack   
  });
}
})
router.post("/makeadmin/:id", authUser, authAdmin, async (req, res) => {
  try {

    const userToUpdate = await userModel.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "Användaren kunde inte hittas" });
    }

    userToUpdate.role = "Admin";
    await userToUpdate.save();

    res.status(200).json({ message: `Användaren ${userToUpdate.username} är nu admin` });
  } catch (error) {
    console.error("🔥 SERVERFEL:", error);
    res.status(500).json({
      message: "Serverfel",
      error: error.message,
      stack: error.stack
    });
  }
});


router.delete("/:_id",authUser,authAdmin,async(req,res)=>{
  const userId = req.params._id
  if(!userId){
    return res.status(400).json({message:"No id was provided"})
  }
  try {
    const findUser = await userModel.findByIdAndDelete(userId)

    if(!findUser){
      return res.status(400).json({sucess:false,
        message:"No user with this ID"})
    }
    res.status(200).json({sucess:true, message:`User ${findUser.username} is now deleted`})
  } catch (error) {
        console.error("🔥 SERVERFEL:", error);
    res.status(500).json({
      message: "Serverfel",
      error: error.message,
      stack: error.stack
    });
  }
} )
export default router