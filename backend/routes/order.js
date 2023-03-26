const express = require("express")
const router = express.Router();


const {newOrder, getSingleOrder,myOrder,allOrder,updateOrder,deleteOrder}=  require('../controllers/ordereController')


const {isAuthenticateUser, authorizeRole}  = require('../middlewares/auth')


router.route('/order/new').post(isAuthenticateUser,newOrder)
router.route('/order/:id').get(isAuthenticateUser,getSingleOrder)
router.route('/orders/me').get(isAuthenticateUser,myOrder)


router.route('/admin/orders').get(isAuthenticateUser,authorizeRole("admin") , allOrder)

router.route('/admin/order/:id')
.put(isAuthenticateUser,authorizeRole("admin") , updateOrder)
.delete(isAuthenticateUser, authorizeRole("admin"), deleteOrder);
module.exports = router