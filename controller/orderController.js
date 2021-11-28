var randomstring = require("randomstring");
const nodemailer = require("nodemailer"); 

const Order = require("../model/Order")
const cart = require("../model/Cart")
const Coupon = require("../model/Coupon")
const Product = require("../model/Product");
const { sendEmail } = require("../utils/mailTransport");
const { populate } = require("../model/Order");
//impot slug generator
const slugGenerator = require("../utils/slugGenerator");
const stripe = require("stripe")(process.env.STRIPE_SECRET)

//get all ordr for admin
exports.allOrder =  (req, res) => {
    Order.find()
    .sort('-createdAt')
    .then( order  => {
     
      res.json({
        status: 1,
        result: order,
        msg: " order data fetched successfully"
      });
    })
    .catch(err => {
      res.json({ status: 0, data: err, msg: " error" });
    });
  }

  //get all ordr for user
exports.userOrder = (req, res) => {
    Order.find({ userID: req.params.UID})
    .sort('-createdAt')
    .then(cart => {
      res.json({
        status: 1,
        result: cart,
        msg: " order data fetched successfully"
      });
    })
    .catch(err => {
      res.json({ status: 0, data: err, msg: " error" });
    });
  }


  //user add order
exports.addOrder = async (req,res) =>{
  // console.log(req.body);
  
  var{orderItems,shipping,paymentMethod,itemsPrice,taxPrice,shippingPrice,coupon} = req.body;

  //generate random track number
  var trackNO = randomstring.generate({
    length: 6,
    charset: 'hex',
    capitalization : "uppercase"
  });

  //get coupon id from coupon
  if (coupon != "" || coupon != null){
    var couponData = await Coupon.findOne({slug : slugGenerator(coupon)});
    
  }
  
  const order = new Order({
    orderItems: orderItems,
    shipping: shipping,
    paymentMethod: paymentMethod,
    userID : req.profile._id,
    userName : req.profile.name,
    itemsPrice: itemsPrice,
    trackNo : trackNO,
    taxPrice: taxPrice,
    shippingPrice: shippingPrice,
    coupon:couponData != null ? couponData._id : null,
    totalPrice: itemsPrice + taxPrice + shippingPrice,
  });

  //save payment method type in database which is provided by user
  if(paymentMethod == "COD"){
    placeOrderDatabaseHelper(order,shipping.email,req,res)
    
  }else if(paymentMethod == "STRIPE"){
 
      stripe.paymentIntents.create({
        amount: Math.round(itemsPrice + taxPrice + shippingPrice),
        currency: "USD",
        description: "Pay to Ecommerce",
        payment_method: req.body.payment_id,
        confirm: true,
      }).then(result =>{
        order.isPaid = true
        placeOrderDatabaseHelper(order,shipping.email,req,res)
      })
      .catch(error => {
        
        res.json({
          status: 0,
          msg : `Unable to process payment ${error}`
        }),
        console.log(error)
      })
   
  }else{
    res.json({
      status: 0,
      data: null,
      msg: `Payment method: ${paymentMethod}, not found!!!`
    });
  }
}


//change user's order status by admin
exports.changeOrderStatus = (req, res) => {
    var {orderStatus,isDelivered} = req.body;
    Order.findOne({ trackNo :  req.params.trackNo})
    .then(order => {
      if(order.length <= 0){
        res.json({
          status: 1,
          result: null,
          msg: " No order found with this ID!"
        });
      }else{
        order.orderStatus = orderStatus;
        order.deliveredAt = Date.now();
        order.save()
        .then(result =>{
          res.json({
            status: 1,
            result: result,
            msg: " Order Status Successfully cahnged!!!"
          });
        })
        .catch(err =>{
          res.json({
            status: 1,
            result: err,
            msg: "Err in changing order statrus" + err
          });
        })
      }
      
    })
    .catch(err => {
      res.json({ status: 0, data: err, msg: " error" + err });
    });
  }
 

  //user track order
exports.trackOrder = (req, res) => {

  Order.findOne({ userID: req.params.UID, trackNo :  req.params.trackNo.toUpperCase()})
  .exec()
  .then(order => {
    res.json({
      status: 1,
      orderStatus: order.orderStatus,
      msg: " Order Sucessfully tracked!"
    });
    
  })
  .catch(err => {
    res.json({ status: 0, data: null, msg: "Invalid track id!!!!" });
  });
  }

// method to help add order function in dtabase save portion
placeOrderDatabaseHelper =(order,email,req,res) =>{
  order
      .save()
      .then(async result => {
        //decrease quantiy after sale
      let bulkOption =  result.orderItems.map(item=> {
         return{
           updateOne:{
             filter:{_id: item.productID},
             update:{$inc : {quantity: -item.productQuantity, sold: +item.productQuantity}}
           }
         }
        })
       await Product.bulkWrite(bulkOption,{})
        //delete the cart data after order is placed
          await cart.deleteMany({userID : req.params.UID})
 
        //send mail
         sendEmail("public/emails/orderConfirmation.ejs",result,email ,"Order confirmation","Order Confirmation!!!!",res)
        
        
      });
}





