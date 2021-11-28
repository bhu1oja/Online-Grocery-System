const express= require("express")
const router = express.Router();

const {allProduct, deleteProduct, addProduct, productDetail, productByCategory} = require("../controller/productController")
const {userById, isAuth, isAdmin, requireSignin} = require("../controller/authController");
const fileUploader = require("../utils/fileUploader");

 
router.get("/all",allProduct)
router.post("/add/:UID", fileUploader("product").array("image",6),requireSignin,isAuth,isAdmin, addProduct)
router.get("/:PID",productDetail)
router.get("/cateory/:categoryID", productByCategory)

router.delete("/delete/:PID/:UID",requireSignin,isAuth,isAdmin,deleteProduct);
 
  router.param("UID", userById);

module.exports = router