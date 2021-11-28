const mongoose = require("mongoose");
 
var ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      slug: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      discount: {
        type: Number
      },
      quantity: {
        type: Number,
        required: true
      },
     trending :{
       type: Boolean,
       default : true
     },
      category: {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true,
      },
      image: {
        type: Array, 
        required: true
      },
      sold: {
        type: Number,
        default: 0,
      },
      addedBy: {
       type : String,
       required: true
      },
      isEnabled: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("Product", ProductSchema)