

let mongoose=require("mongoose")

let Signup=mongoose.Schema({
    email:String,
    password:String

})

let Signupmodel=mongoose.model('Sign',Signup)

module.exports={
    Signupmodel
}