const mongoose = require("mongoose")



const connectDatabse  = ()=>{
   mongoose.connect(process.env.databse,{
    useNewUrlParser:true
   }).then(con=>{
    console.log("databse is connect")
   })
}

module.exports = connectDatabse