
const Cart = require("../model/Cart");
const Product = require("../model/Product");


//get user cart data
exports.getCart = (req, res) => {
    Cart.find({ userID: req.params.UID})
    .sort('-createdAt')
    .then(cart => {
      res.json({
        status: 1,
        result: cart,
        msg: " Cart data fetched successfully"
      });
    })
    .catch(err => {
      res.json({ status: 0, data: err, msg: " error" + err });
    });
  }

//add cart of user
exports.addCart= async (req,res) =>{
    var userID = req.params.UID
    var {
    productID,
    productName,
    productImage,
    productPrice,
  } = req.body;
  //get product detail by id
  var product = await Product.findById(productID);

  // if product have no quantity
  if(product.quantity <=0){
    res.json({ status: 0, data: null, msg: " Product out of stock!!!" })

  // if cart quantity is greater than product quantity
  }else if(product.quantity < 1){
    res.json({ status: 0, data: null, msg: "only ${product.quantity} items left..." })

  // if we have enought product quantity than cart's product quantity 
  }else{
    Cart.findOne(
      { productID: productID, userID: userID },
      (err, cartData) => {
        if (!cartData) {
          const cart = new Cart({
            productID: productID,
            productName: productName,
            productImage: productImage,
            userID : userID,
            productPrice: Number(productPrice)
          });
          cart
            .save()
            .then(result => {
              res.json({
                status: 1,
                data: result,
                msg: " successfully added to cart"
              });
            })
            .catch(err => {
              res.json({
                status: 0,
                data: err,
                msg: " error while adding in cart"
              });
            });
        } else {
          res.json({
            status: 1,
            msg: "already in cart :  " + cartData.productQuantity
          });
        }
      }
    );
  }

  
  
  }

  //increase individual item quantity
  exports.increaseCart= async (req, res) => {
//get from parameter
    var pid = req.params.PID;
    var userID = req.params.UID;
//get product detail by id
    var product = await Product.findById(pid);
    //get cart detail by UId and PID. Specific product exist in specific user's cart 
    var cartData = await Cart.findOne({ productID: pid, userID: userID });


// if product have no quantity
    if(product.quantity <=0){
      res.json({ status: 0, data: null, msg: " Product out of stock!!!" })
      // if cart quantity is greater than product quantity
    }else if(product.quantity <= cartData.productQuantity){
      res.json({ status: 0, data: null, msg: `only ${product.quantity} items left...` })
    // if we have enought product quantity than cart's product quantity
    }else{
      var updatedQuantity = cartData.productQuantity + 1;
      cartData.productQuantity = updatedQuantity;
    
      cartData
          .save()
          .then(result => {
            res.json({
              status: 1,
              data: result,
              msg: " successfully updated" + cartData.productQuantity
            });
          })
          .catch(err => {
            console.log(err);
            res.json({ status: 0, data: err, msg: " error "  + err});
          });
    }
    
  }
  
  //decrease individual item quantity
 exports.decreaseCart = async (req, res) => {
    var pid = req.params.PID;
    var userID = req.params.UID;
    Cart.findOne(
      { productID: pid, userID: userID},
      (er, update) => {
        if (er)
          return res.json({
            status: 0,
            data: er,
            msg: " error while updating data on cart"
          });
        var updatedQuantity = update.productQuantity - 1;
        update.productQuantity = updatedQuantity;
        
        if(updatedQuantity <=0){
          Cart.findOneAndDelete({userID: userID, productID:pid})
          .then(result =>{
           res.json({
             status: 1,
             result: null,
             msg: `${result.productName} removed from cart!!!`
           });
          })
          .catch(err => {
           res.json({ status: 0, data: err, msg: " error" + err})
         })
        }
       else{
        update
        .save()
        .then(result => {
          res.json({
            status: 1,
            data: result,
            msg: " successfully updated" + update.productQuantity
          });
        })
        .catch(err => {
          console.log(err);
          res.json({ status: 0, data: err, msg: " error on update" });
        });
       }
      }
    );
  }

//detele individual cart item 
exports.deleteCart =async (req,res) =>{
    Cart.findByIdAndRemove(req.params.CID)
    .then(result =>{
     res.json({
       status: 1,
       result: null,
       msg: `${result.productName} removed from cart!!!`
     });
    })
    .catch(err => {
     res.json({ status: 0, data: err, msg: " error" })
   })
  }

