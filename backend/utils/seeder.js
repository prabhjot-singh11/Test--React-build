const Product = require("../models/product")

const dotenv = require('dotenv')

const connectDatabse = require("../databse")

const products  =require('../data/product.json')

dotenv.config({path:"backend/config.env"})

connectDatabse();

const seedProducts = async()=>{
    try {
        await Product.deleteMany();
        console.log("productsare deletes")
        await Product.insertMany(products)
        console.log("all data is ")
        process.exit();
        
    } catch (error) {
        console.log(error)
        
    }
}

seedProducts()