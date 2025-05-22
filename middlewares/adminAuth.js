import userModel from "../models/userSchema.js"
const userRole =  async (req, res, next)=> {
    try {
        const userId = req.user?.id
        console.log("req.user:", req.user);

        if(!userId){
            return res.status(400).json({message:"No matching id"})
        }


        const findUser = await userModel.findById(userId)

        if(findUser.role !== "Admin"){
            return res.status(403).json({message:"You do noy have premisson fot this action"})
        }

        next()

    } catch (error) {
                      console.error("🔥 SERVERFEL:", error); 
  res.status(500).json({
    message: "Server error",
    error: error.message, 
    stack: error.stack   
  });
    }
}

export default userRole