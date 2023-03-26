const express = require("express");
const app = require("../app");
// const { get } = require("mongoose")

const router = express.Router()


const {getProducts, NewProduct,getSingleProduct,getAdminProducts, updateProdect,deleteproduct,createProductReview,getProductReviews,deleteReview,Products}=  require("../controllers/productController")

const{ isAuthenticateUser, authorizeRole }=  require('../middlewares/auth')



router.route('/products').get( getProducts);
router.route('/allproducts').get( Products);
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/products').get(getAdminProducts);
router.route('/admin/product/new').post(isAuthenticateUser,authorizeRole('admin'), NewProduct);
router.route('/admin/product/:id').put(isAuthenticateUser,authorizeRole('admin'), updateProdect).delete(isAuthenticateUser,deleteproduct);
router.route('/review').put(isAuthenticateUser,createProductReview)
router.route('/reviews').delete(isAuthenticateUser,deleteReview)

module.exports = router;