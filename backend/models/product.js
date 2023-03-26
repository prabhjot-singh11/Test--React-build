const mongoose = require('mongoose')


const productScema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLenght:[100,"please enter the name under 100 words"]
    },
    price:{
        type:Number,
        required:true,

    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings:{
        type:Number,
        default:0,

    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    
    category:{
        type:String,
        required:[true,"please select the catagory"],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'BOOks',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdor',
                'Home'

            ],
            message:'Please select correct catagory for product'

            
        }
    },
    seller:{
        type:String,
        required:[true,"Plese select the seller"]
    },
    stock:{
        type:Number,
        require:[true,'fjfjjfjf'],
        maxLenght:[5,'product name excuded 5 characters'],
        default:0
    },
    numOfReviews:{
        type:String,
        default:0,
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name:{
                type:String,
                required:true,

            },
            rating:{
                type:Number,
                require:true
            },
            Comment:{
                type:String,
                required:true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }


})
module.exports= mongoose.model('prouct',productScema)