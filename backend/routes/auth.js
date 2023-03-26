const  express = require('express')
const router = express.Router()


const { registerUser, loginUser, logout,forgetPassword,resetPassword,getUserProfile,updatePassword,updateProfile,allUsers,getUserDetails,updateUser
,deleteUser} = require('../controllers/authController')
const {isAuthenticateUser,authorizeRole}= require('../middlewares/auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgetPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticateUser,  getUserProfile)
router.route('/password/update').put(isAuthenticateUser, updatePassword)
router.route('/me/update').put(isAuthenticateUser, updateProfile)




router.route('/admin/users').get(isAuthenticateUser,authorizeRole("admin") , allUsers)

router.route('/admin/user/:id')
.get(isAuthenticateUser,authorizeRole("admin") , getUserDetails)
.put(isAuthenticateUser,authorizeRole("admin"),updateUser)
.delete(isAuthenticateUser,authorizeRole("admin"),deleteUser)
module.exports = router