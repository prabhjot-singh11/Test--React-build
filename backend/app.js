const express = require("express")
const cookieParser = require("cookie-parser")
const app= express();
const bodyparser = require("body-parser")
const cors = require('cors')
const cloudinary = require("cloudinary")
const fileUpload = require("express-fileupload")
const path = require('path')


const errorMiddleware = require('./middlewares/errors')
app.use(cors({
    origin:"http://127.0.0.1:3000"
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload())








const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')
const payment = require('./routes/payment')



app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1', payment)
app.use('/api/v1',order)



    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })


app.use(errorMiddleware)

module.exports=app