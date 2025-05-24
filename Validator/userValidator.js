import validator from "fastest-validator"

const v = new validator()

const schema = {
    username: {type: "string"},
    password: {type: "string"},
    email: {type:"string"}

};

const check = v.compile(schema)

const userValidator = (req,res,next)=> {
const result = check(req.body)
 if(result === true){
    next()
 }else{
    return res.status(400).json({message:"The validator stopped the procces",error:result})
 }
}