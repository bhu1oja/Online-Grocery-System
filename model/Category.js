const mongoose = require("mongoose");

const Category = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
      required: "Name is required",
      minlength: [2, "Too short"],
      maxlength: [32, "Too long"],
        },
        slug :{
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            maxlength: 32,
            unique: true 
        },
        image:{
            type: String,
            
        },
        addedBy: {
            type : String,
            required: true
           },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", Category);
