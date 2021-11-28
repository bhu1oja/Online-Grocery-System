const express = require("express");
const router = express.Router();

// controller
const { create, remove, list, applyCouponToUserCart, block } = require("../controller/couponController");

const{isAdmin,isAuth,requireSignin, userById} = require("../controller/authController")




router.post("/add/:UID",requireSignin,isAuth,isAdmin, create);
router.get("/all/:UID", requireSignin,isAuth,isAdmin,list);
router.get("/block/:couponId/:UID", requireSignin,isAuth,isAdmin, block);
router.delete("/delete/:couponId/:UID", requireSignin,isAuth,isAdmin, remove);

//apply coupon
router.post("/apply-coupon/:UID",requireSignin,isAuth, applyCouponToUserCart);

router.param("UID", userById);
module.exports = router;
