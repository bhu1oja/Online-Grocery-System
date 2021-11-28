const express = require("express");
const router = express.Router();


const { requireSignin,isAuth, isAdmin, userById } = require("../controller/authController");
const { allOrder, userOrder, addOrder, trackOrder, changeOrderStatus } = require("../controller/orderController");

router.get("/all/:UID",requireSignin,isAuth,isAdmin, allOrder)
router.get("/user/:UID",requireSignin,isAuth, userOrder)
router.post("/add/:UID/",requireSignin,isAuth, addOrder)
router.get("/track/:UID/:trackNo",requireSignin,isAuth,trackOrder)
router.post("/change-status/:UID/:trackNo",requireSignin,isAuth,isAdmin, changeOrderStatus)


router.param("UID", userById);
module.exports = router;