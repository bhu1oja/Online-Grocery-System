const path = require('path')
var fs = require('fs');
//import category model
const Product = require("../model/Product")

//impot slug generator
const slugGenerator = require("../utils/slugGenerator");
const Category = require('../model/Category');


//get all products
exports.allProduct = (req, res) =>{
  Product.find()
  .sort('-createdAt')
    .then(result =>{
        res.json({
            status : 1,
            result : result,
            msg : "All Products Fetched!"
        })
    })
    .catch(err =>{
        res.json({
            status : 0,
            result : err,
            msg : `Error in fetch product ${err}`
        })
    })
}


//add new product
exports.addProduct =async (req,res) =>{
  let {title,description,price,discount,quantity,trending, category} = req.body


  if(price <= discount ){
    res.json({
      status : 0,
      result : null,
      msg : "Price should be greater than discount"
  
  });

  }else{
    var cat =await Category.findOne({slug: slugGenerator(category)});
    if(cat){ let slug = slugGenerator(title)
   
     //get images an d push it in reqFiles
      var reqFiles = [];
     const url = req.protocol + '://' + req.get('host')
     for (var i = 0; i < req.files.length; i++) {
         reqFiles.push(url + '/product/' + req.files[i].filename)
     }
   
     Product.findOne({slug:slug}, (err,product) =>{
       if (err) {
         res.status(400).json({
           result: "failed",
           message: `Cannot add product ${err}`
         });
       }
       if (product) {
         res.json({
           status: 0,
           result: product.title,
           msg: " product already exists"
         });
       }else{
         let product = new Product({
           title : title,
           description :description,
           category :cat.id,
           price:price,
           discount : discount,
           quantity : quantity,
           slug : slug,
           image: reqFiles,
           trending : true,
           addedBy : req.profile.email
           
       })
       product.save()
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
   }else{
   
     return res.json({
             
       status : 0,
       result : null,
       msg : "Category not found!!!"
   
   });
   }
   
   
  }

 

} 

//get product detail by id
exports.productDetail =(req,res) =>{
  let PID = req.params.PID
    Product.findById(PID)
    .exec()
    .then(result =>{
        res.json({
            status : 1,
            result : result,
            msg : "Single Product fetched!"
        })
      .catch(err =>{
          res.json({
              status : 0,
              result : err,
              msg : `Error in fetch product detail ${err}`
          })
      })
       
      
    })
    .catch(err =>{
        res.json({
            status : 0,
            result : err,
            msg : `Error in fetch post ${err}`
        })
    })
}

//get products according to category
exports.productByCategory= (req,res) =>{
  let category = req.params.categoryID
  Product.find({category : { $in : [category]  } })
  .sort({ createdOn: -1 })
  .then(result =>{
      res.json({
          status : 1,
          result : result,
          msg : "Product with category fetched!!"
      })
  })
  .catch(err =>{
      res.json({
          status : 0,
          result : err,
          msg : `Error in fetch product by category ${err}`
      })
  })
}

//delete the product
exports.deleteProduct = async (req,res) =>{ 
  let PID = req.params.PID

   var product = await Product.findById(PID)

   if(product == null){
    res.json({
      status : 0,
      msg : "Product Not Found!!!"
  })
   }else{
    Product.findByIdAndRemove(PID)
    .then(result =>{
      try {
        //when product is deleted , ite image will also deleted from server
        result.image.forEach(img=> fs.unlinkSync(
          "public/product/"+img.substring(img.lastIndexOf("/") + 1, img.lastIndexOf("."))+ "."+path.extname(img).substr(1)
          ))
        res.json({
          status : 1,
          msg : `${result.title} , successfully deleted !!!`
      })
      } catch (error) {
        res.json({
          status : 0,
          msg : "First catch" +  error
      })
      }
      
        
    })
    .catch(err =>{
        res.json({
            status : 0,
            msg : err
        })
    })
   }
  
}