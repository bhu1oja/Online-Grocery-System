var express = require("express");
var router = express.Router();
const {
  requireSignin, //uswr must be signed in
  userById,
  isAdmin,
  isAuth, // signedin user and current user should be same
  signup,
  signin,
  activationController,
  changePassword,
  forgotPassword,
  forgotPasswordActivator,
  allUsers,
  deleteUser,
  contactUs
} = require("../controller/authController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-activator/:token", forgotPasswordActivator);
router.get('/activate/:token', activationController)
router.get('/all/:UID', requireSignin, isAuth,isAdmin,allUsers)
router.put('/change-password/:UID', requireSignin,isAuth,changePassword)

router.post('/contact-us',contactUs)


router.put("/block/:UID",requireSignin, isAuth, deleteUser);


//everytime we see UID on route it will call userById method
router.param("UID", userById);
  // Exports
module.exports = router;