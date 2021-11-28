const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderItems: [ 
      {
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        productPrice: { type: Number, required: true },
        productQuantity: { type: Number, required: true },
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
   
      userID  : { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
      userName : {type:String, required: true},
     
    
    shipping: {
      city: String,
      country: String,
      phoneNumber: Number,
      email: String,
      name: String
    },

      paymentMethod: {type: String, require:true},
    

    trackNo:String,
    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    coupon : {type: mongoose.Schema.Types.ObjectId, ref: 'Coupon'},
    orderStatus: {type:String, default: "Order Placed"},
    isPaid: { type: Boolean, required: true, default: false },
    orderedAt: {type: Date, default: Date.now()},
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: {type: Date},
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Order', OrderSchema);
