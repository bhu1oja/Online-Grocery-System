const express= require("express")
const router = express.Router();

const {allCategory,addCategory, deleteCategory} = require("../controller/categoryController")
const {userById, isAuth, isAdmin, requireSignin} = require("../controller/authController");
const fileUploader = require("../utils/fileUploader");


router.get("/all",allCategory)
router.post("/add/:UID", fileUploader("category").single("image"),requireSignin,isAuth,isAdmin,addCategory)
router.delete("/delete/:CID/:UID",requireSignin,isAuth,isAdmin,deleteCategory);
 
router.param("UID", userById);

module.exports = router