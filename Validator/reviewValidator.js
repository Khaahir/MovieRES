import Validator  from "fastest-validator";

const v = new Validator()

const schema ={
    userId: {type:"number"},
    rating:{type:"number"},
    comment:{type:"string"}
}

const check = v.compile(schema)

const reviewValidator= (req,res,next)=> {
    const result = check(req.body)
    if(result === true){
        next()
    }else{
        return res.status(400).json({message:"The validator stopped this Procces",error:result})
    }
}

export default reviewValidator