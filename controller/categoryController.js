
//import category model
const Category = require("../model/Category")
const Product = require("../model/Product")
const path = require('path')
var fs = require('fs');

//impot slug generator
const slugGenerator = require("../utils/slugGenerator")

//get all category
exports.allCategory = (req, res) =>{
    Category.find()
    .sort('-createdAt')
    .then(result =>{
        res.json({
            status : 1,
            result : result,
            msg : "All category fetched!"
        })
    })
    .catch(err =>{
        res.json({
            status : 0,
            result : err,
            msg : `Error in fetch category ${err}`
        })
    })
}


//add category for admin
exports.addCategory =(req,res) =>{
    let {title} = req.body
    let slug = slugGenerator(title)
    const url = req.protocol + '://' + req.get('host')  //get url protocol of request url
  var reqFile  = url + '/category/' + req.file.filename
  Category.findOne({slug:slug}, (err,category) =>{
    if (err) {
      res.status(400).json({
        result: "failed",
        message: `Cannot add category ${err}`
      });
    }
    if (category) {
      res.json({
        status: 0,
        result: category.title,
        msg: " Category already exists"
      });
    }else{
      let category = new Category({
        title : title,
        slug : slug,
        addedBy : req.profile.email,
        image: reqFile,
       
        
    })
    category.save()
    .then(result =>{
     
        res.json({
            status : 1,
            result : result,
            msg : `${result.title} successfully added!!!`
        })})
    .catch(
       err =>{
         console.log(err)
        return res.status(400).json({
          
            status : 0,
            result : null,
            msg : `Error occured ${err}`
        
        });
       }
    )
    }
  })

}


//delete category for admin
exports.deleteCategory =async (req,res) =>{
  let CID = req.params.CID
  let category =await Category.findById(CID)
  if(category == null){
    res.json({
      status : 0,
      msg : "Category Not Found"
  })
  }else{
   var deleteProduct = await Product.deleteMany({"category" : CID});
   if(deleteProduct){ 

    Category.findByIdAndRemove(CID)
    .then(result =>{
      //deleet category photo from server server after deleting category
      fs.unlinkSync("public/category/"+result.image.substring(result.image.lastIndexOf("/") + 1, result.image.lastIndexOf("."))+ "."+path.extname(result.image).substr(1))
        res.json({
            status : 1,
            msg : `${result.title} , successfully deleted !!!`
        })
    })
    .catch(err =>{
        res.json({
            status : 0,
            msg : `Error ${err}`
        })
    })}else{
    res.json({
      status : 0,
      msg : "unable to delete. Plase try again later!!!"
  })
   }

   
  }
}