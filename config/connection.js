let mongoose=require('mongoose')

require('dotenv').config()

let Connection=mongoose.connect(process.env.connect)

module.exports={
    Connection
}