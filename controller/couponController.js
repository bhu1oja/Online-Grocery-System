const Order = require("../model/Order")
const Coupon = require( "../model/Coupon");
const slugGenerator = require("../utils/slugGenerator");

//create coupon
exports.create = async (req,res) =>{
    const { name, discount } = req.body;
   var existingCoupon =await Coupon.findOne({slug:slugGenerator(name)});
   if(existingCoupon){
    res.json({ status: 0, data: null, msg: "Coupon already exist.." + existingCoupon.name });

   }
  else
  {
    var coupon = new Coupon({
      name: name,
      discount : parseInt(discount),
      slug: slugGenerator(name),
      addedBy : req.profile.email
  })
  coupon.save()
  .then(coupon => {
      res.json({
        status: 1,
        result: coupon,
        msg: `Coupon ${coupon.name.toUpperCase()} successfully added!!`
      });
    })
  .catch(err => {
      res.json({ status: 0, data: err, msg: " Error in adding coupon " + err });
    })
  }
}

//delete remove
exports.remove = async (req,res) =>{
    Coupon.findByIdAndDelete(req.params.couponId)
    .exec()
    .then(coupon => {
        res.json({
          status: 1,
          result: coupon,
          msg: `Coupon ${coupon.name.toUpperCase()} successfully Deleted!!`
        });
      })
    .catch(err => {
        res.json({ status: 0, data: err, msg: " Error in deleting coupon" + err });
      })
}

exports.block = async (req,res) =>{


 var couponData  =  await  Coupon.findById(req.params.couponId)
 couponData.enabled = !couponData.enabled;
 couponData.save().
    then(result => {
      res.json({
        status: 1,
        result: couponData,
        msg: `Coupon ${couponData.name.toUpperCase()} successfully ${ couponData.enabled ? 'Enabled' : 'Disabled'}!!`
      });
    })
  .catch(err => {
      res.json({ status: 0, data: err, msg: " Error while disabling coupon" + err });
    })
}


//find all coupon
exports.list = async (req,res) =>{
    Coupon.find({})
    .sort({ createdAt: -1 })
    .exec()
    .then(coupon => {
        res.json({
          status: 1,
          result: coupon,
          msg: `All coupon fetched successfully!!!`
        });
      })
    .catch(err => {
        res.json({ status: 0, data: err, msg: " Error in fetching all coupons " + err });
      })
}

//apply coupon to cart data
exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({ slug: slugGenerator(coupon) }).exec();

  if (validCoupon === null) {
    return res.json({ status: 0, data: null, msg: `INVALID COUPON : ${coupon}` });
  }
  if (!validCoupon.enabled) {
    return res.json({ status: 0, data: null, msg: `Coupon : ${coupon} already expired!!!` });
  }
 

  //apply one coupon to user only for one time
  Order.findOne({ userID: req.params.UID, coupon : validCoupon._id })
    .then( orderData => {
      console.log(orderData);
     if(orderData == null || orderData == undefined){
    res.json({
      status: 1,
      data: validCoupon,
      msg: " Coupon Successfully Applied!!!"
    });
    
    }else{
      res.json({
        status: 0,
        data: null,
        msg: " Coupon Already Applied!!!"
      });
    }
    })
    .catch(err =>
      res.json({
        status: 0,
        data: err,
        msg: " error while adding applying coupon" + err
      }))
  

};