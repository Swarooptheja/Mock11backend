
let express=require('express')
let mongoose=require("mongoose")
let jwt=require('jsonwebtoken')
let Auth=(req,res,next)=>{
    let token=req.headers.authorization?.split(" ")[1]
    console.log(token)
    if(token){
      jwt.verify(token, 'secret', function(err, decoded) {
        if(decoded){
            let UserId=decoded.UserId
            req.body.UserId=UserId;
            next()
        }
        else{
            res.send('please login again')
        }
      });
    }
    else{
        res.send('please login again')
    }
}

module.exports={
    Auth
}