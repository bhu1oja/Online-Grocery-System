const express = require("express")
const mongoose = require("mongoose")
const path = require("path");
const cors = require('cors')

//configure .env file to use its variables
require('dotenv').config();


// Configure express
const app = express();

//db Config
const db = require("./config/db").mongoURI;

 // Connect to database
 mongoose
 .connect(db, { useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex:true})
 .then(() => console.log("Connected to database : " + db ))
 .catch(err => console.log(err));

 //bodyparser data in json
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));


//static public folder
app.use("/", express.static(path.join(__dirname, "public")));

//CORS policy
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/category", require("./routes/category"))
app.use("/api/product", require("./routes/product"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/coupon", require("./routes/coupon"))
app.use("/api/order", require("./routes/order"))



const port = process.env.PORT || 8000;

//start the server
app.listen(port,() =>{
    console.log(` Server running at port with url : ${process.env.CLIENT_URL}`)
})