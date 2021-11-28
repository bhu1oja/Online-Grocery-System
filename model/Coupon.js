const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        unique: true,
        uppercase: true,
        required: "Name is required",
        minlength: [2, "Too short"],
        maxlength: [12, "Too long"],
      },

      slug :{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        maxlength: 32,
        unique: true 
    },
      enabled:{
        type: Boolean
        ,require : true,
        default : true

      },
      discount: {
        type: Number,
        requred: true,
      }, addedBy: {
        type : String,
        required: true
       },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Coupon", couponSchema);
  