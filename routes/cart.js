const express= require("express")
const router = express.Router();

const { requireSignin, isAuth,userById } = require("../controller/authController");
const { getCart, addCart, increaseCart, decreaseCart, deleteCart } = require("../controller/cartController");

 

 router.get("/:UID", requireSignin, isAuth,getCart)
 router.post("/add/:UID", requireSignin, isAuth,addCart)
 router.post("/increase/:PID/:UID",requireSignin, isAuth, increaseCart)
 router.post("/decrease/:PID/:UID",requireSignin, isAuth, decreaseCart)

 router.delete("/delete/:UID/:CID",requireSignin, isAuth, deleteCart)

 router.param("UID", userById);

 module.exports = router

