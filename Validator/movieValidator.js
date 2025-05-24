import validator from "fastest-validator"

const v = new validator()

const schema ={
title: {type: "string"},
director:{type:"string"},
releseYear:{type: "number"},
gener:{type:"string"}
}

const check = v.compile(schema)


const movieValidator = (req, res, next)=>{
    const result = check(req.body)
 if(result === true ){
    next()
 }else{
    return res.status(400).json({message:"The validator stopped this procces", error:result})
 }
}

export default movieValidator