
let express=require("express")
let mongoose=require('mongoose')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let cors=require("cors")
const { Connection } = require("./config/connection");
const { Signupmodel } = require("./Model/Signupmodel");
const { Auth } = require("./authentification");



let app=express()
app.use(express.json())
app.use(express.text())
app.use(cors({
    origin:"*"
}))


app.post("/signup",(req,res)=>{
    let {email,password}=req.body;
    try{
        bcrypt.hash(password, 15, async function(err, hash) {
            let data=new Signupmodel({email,password:hash})
            await data.save()
            res.send("Signup success")
            console.log(data)
        });
    }
    catch(err){
        console.log(err)
    }
})

app.post("/login",async(req,res)=>{
    let {email,password}=req.body
    let data=await Signupmodel.find({email})
    let hash=data[0].password
    if(data.length>0){
        try{
            bcrypt.compare(password, hash, function(err, result) {
               if(result){
                var token = jwt.sign({UserId:data[0]._id}, 'secret',{expiresIn:'1h'});
                res.send({message:"login Success",token:token})
               }
               else{
                res.send("please try again later")
               }
            });
        }
        catch(err){
            console.log(err)
        }

    }
    else{
        res.send('Invalid credentials please try again')
    }
})



app.use(Auth)

app.get("/",(req,res)=>{
    res.send('home page appear')
})

app.listen(7000,async()=>{
    try{

        await Connection
        console.log('7000 port is running')
    }
    catch(err){
        console.log(err)
    }
})