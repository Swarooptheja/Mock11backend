
let express=require("express")
let mongoose=require('mongoose')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let cors=require("cors")
const { Connection } = require("./config/connection");
const { Signupmodel } = require("./Model/Signupmodel");
// const { Auth } = require("./authentification");



let app=express()
app.use(express.json())
app.use(express.text())
app.use(cors({
    origin:"*"
}))


app.post("/signup",(req,res)=>{
    let {email,password,name}=req.body;
    try{
        bcrypt.hash(password, 20, async function(err, hash) {
            let data=new Signupmodel({email,password:hash,name})
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
                var token = jwt.sign({UserId:data[0]._id}, 'secret',{expiresIn:'2h'});
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



// app.use(Auth)

app.get("/getprofile",(req,res)=>{
    let token=req.headers.authorization?.split(" ")[1]
    if(token){
      jwt.verify(token, 'secret', async function(err, decoded) {
        if(decoded){
            console.log(decoded,"decoded")
            let UserId=decoded.UserId
            // req.body.UserId=UserId;
            if(UserId){
                let data=await Signupmodel.find({UserId})
                res.send(data)
            }

            
        }
        else{
            res.send('please login again')
        }
      });
    }
    else{
        res.send('please login again')
    }
})

app.get("/calculate",(req,res)=>{
    let {P,I,N}=req.body
    // console.log(P,I,N)
    I=I/100
    console.log(I,"I")
    let a=((1+I)**N)-1;
    let b=a/I
    let f=P*b

    // console.log(f)
    let totalInvestimentamout=P*N;
    console.log(totalInvestimentamout,"mrp")
    let totalgained=f-totalInvestimentamout
    console.log(totalgained)

    res.status(200).send((totalgained.toString()))


})

app.listen(8000,async()=>{
    try{

        await Connection
        console.log('8000 port is running')
    }
    catch(err){
        console.log(err)
    }
})