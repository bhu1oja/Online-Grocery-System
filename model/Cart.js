const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    productID: {
      type: ObjectId,
      ref: "Product",
    },
    productName: { type : String, required : true},
    productImage: { type : String, required : true},
    productPrice: { type : Number, required : true},
    productQuantity: { type : Number,  default:1},
    userID: { type: ObjectId, ref: "User" , required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
