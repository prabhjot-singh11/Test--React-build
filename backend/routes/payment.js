const express = require('express')
const router = express.Router();

const {
   processPayment,
   sendStripApi
} = require('../controllers/paymentController')

const { isAuthenticateUser } = require('../middlewares/auth')

router.route('/payment/process').post(isAuthenticateUser, processPayment);
router.route('/stripeapi').get(isAuthenticateUser, sendStripApi);

module.exports = router;