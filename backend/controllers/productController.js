const express = require("express")
const { trusted } = require("mongoose")
const bodyParser = require('body-parser');

const app = require("../app")

const errorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncErrors")

const Product = require("../models/product")
 const APIFeature = require('../utils/apifeature')
const ErrorHandler = require("../utils/errorHandler")
const cloudinary = require("cloudinary")




exports.NewProduct = catchAsyncError  (async(req,res,next)=>{
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;


   req.body.user=req.user.id



  
    const product=  Product.create(req.body)
  
    res.status(201).json({
        success:true,
        product
    })

  
})







exports.getProducts= catchAsyncError ( async(req,res,next)=>{

const resPerPage = 4;
const productsCount = await Product.countDocuments();

const apifeature =new APIFeature(Product.find(),req.query)
                   .search()
                   .filter()
                   .pagination(resPerPage)
             


            const products = await apifeature.query;
            let filteredProductsCount = products.length;
            apifeature.pagination(resPerPage)


//   products = await apifeature.query;
 setTimeout(()=>{
    res.status(200).json({
        success:true,
        count :products.length,
        productsCount, 
        resPerPage,
        filteredProductsCount,
        products
    })
 })
  
})


// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})



exports.getSingleProduct = catchAsyncError (async(req,res, next)=>{
    const product  =await Product.findById(req.params.id)
    if(!product){
        return next(new errorHandler('product nor found',404));
       
    }
    res.status(200).json({
        success:true,
        product
    })
})



exports.updateProdect = async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success:false,
            messege:"product not found"
        })
    }


    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators : true,
        useFindAndModyfy:false

    })
    res.status(200).json({
        success:true,
        product
    })
}


exports.deleteproduct= async(req,res,next)=>{
    const product = Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success:false,
            messege:"product not found"
        })
    }

 
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

   

    await Product.deleteOne();
    res.status(200).json({
        success:true,
        messege:"Product is deleted"
    })

    
    
}





// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.Comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})





exports.Products= catchAsyncError ( async(req,res,next)=>{

  
    
  const product =await Product.find({})
                      
    
    
           
      const productsCount = await Product.countDocuments();
    
    //   products = await apifeature.query;
     setTimeout(()=>{
        res.status(200).json({
            success:true,
            productsCount,
           
         
          
            product
        })
     })
      
    })