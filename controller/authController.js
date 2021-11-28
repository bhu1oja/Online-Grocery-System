const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
var User = require("../model/Auth")

const { sendEmail } = require('../utils/mailTransport');

//signup controller
exports.signup =  async  (req, res)  => {
    const { name,phone, email, country, city,password } = req.body;
    const token = jwt.sign(
      {
        name,
        phone,
        email,
        country,
        city,
        password
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '5m'
      }
    );
  let user =  await User.findOne({
        email
      });

        if (user) { 
          return res.status(400).json({
                status : 0,
                result : null,
                msg : `Email is already taken!!!!`
          });
        }
        else{
          //create a token
       
//SEND EMAIL
       sendEmail("public/emails/emailConfirmation.ejs",`${process.env.CLIENT_URL}/api/auth/activate/${token}` ,email,'Verify your email address',"Email sent...",res);
        
      }
    
};


//activate acount from mail registration
exports.activationController =  (req, res)  => {
    const token =  req.params.token;
  // get token url from user and activate
    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,async (err, decoded)  => {
        if (err) {
          console.log('Activation error');
          //if session expire
          return res.status(401).json({
            status : 0,
                result : null,
                msg : `Error link already expired, please signup again!!!`
          });
        } else {
          const {name, phone,email,tole,city,country, password } = jwt.decode(token);
          var existingUser = await User.findOne({email});
          if(existingUser){
           return res.json({
              status : 0,
              result : null,
              msg : `${email} already signed up...`
            })
          }else{
          const user = new User({
            name,
            phone,
            email,
            tole,
            city,
            country,
            password
          });
   
          user.save((err, user) => {
            if (err) {
              return res.status(401).json({
                status : 0,
                result : null,
                msg : `Error: ${err}`
              });
            } else {
                user.salt = undefined;
                user.hashed_password = undefined;
              return res.json({
                status : 1,
                result : user,
                msg : `Signup Successful as ${email}`
              });
            }
          });
          }
  
        
        }
      });
    } else {
      return res.json({
        status : 0,
                result : null,
                msg : `Error: Where is token bruh!!!`
      });
    }
  };

  //signin controller
exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({email: email }, (err, user) => {
        if (err || !user) {
            return res.json({
                    status : 0,
                    result : null,
                    msg : "User with that email does not exist. Please signup"
       
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.json({
                status : 0,
                 msg : `Email and password dont match`
                
            });
        }
        
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // // persist the token as 't' in cookie with expiry date
        // res.cookie('t', token, { expire: new Date() + 9999 });

        // return response with user and token to frontend client
         const { _id, name, email, type,phone,country,city,enabled } = user;
         return res.json({ token, result: { _id, email, name, type,phone,country,city,enabled }, 
            status : 1,
            msg : `User Loggedin as ${name}`
         });
    });
};


//change password controller
exports.changePassword =async(req,res)  =>{
  
    var {currentPassword, newPassword} = req.body;
    let user = await User.findById(req.profile.id);
    if (!user.authenticate(currentPassword)) {
     return res.status(401).json({
         status : 0,
          msg : `Current password is incorrect!!`
         
     });
 }else{
   if(currentPassword == newPassword){
     res.json({
       status: 0,
       result: {currentPassword, newPassword},
       msg: "burh, both password are same!! >.<"
     })
   }
  
  else{
   user.password = newPassword;
   user.save()
   .then(result =>{
     res.json({
       status: 1,
       result: result,
       msg: " Password Sucessfully changed!!!"
     });
   })
   .catch(err => {
     res.json({ status: 0, data: err, msg: " error"+err });
   });
  }
 }
     
 
   
 }
 
 //forgot password controller
 exports.forgotPassword = async (req,res) => {
   var {email} = req.body;
    const myToken = jwt.sign(
     {
       email
     },
     process.env.JWT_SECRET,
     {
       expiresIn: '5m'
     }
   );
   let user =await User.findOne({email : email});
  
   if(!user){
     res.status(400).json({
       status : 0,
       result : null,
       msg : `User with email: ${email} Not Found!!!`
 }); 
 
   }

   //mail transport credentials
 else{
  sendEmail("public/emails/forgotPassword.ejs",`${process.env.CLIENT_URL}/api/auth/forgot-password-activator/${myToken}`,email,'Change your password',"Password reset link sent to email!",res);
 }
 
 }
 

 //active url from forgot password
 exports.forgotPasswordActivator = async (req,res) =>{
   
   var {password} = req.body;
   const token =  req.params.token;
   
     if (token) {
       jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,async (err, decoded) => {
        
         if (err) {
           console.log('Activation error');
           return res.status(401).json({
             status : 0,
                 result : null,
                 msg : `Error link already expired, please request againi!!!`
           });
         }else{
           let user =await User.findOne({email : decoded.email}).exec();
           if(!user){
             res.status(400).json({
               status : 0,
               result : null,
               msg : `User with email: ${decoded.email} Not Found!!!`
         });
         
           }else{
             user.password = password;
             user.save()
             .then(result =>{
               res.json({
                 status: 1,
                // result: result,
                 msg: " Password Sucessfully changed!!!"
               });
             })
             .catch(err => {
               res.json({ status: 0, data: err, msg: " error"+err });
             });
           }
         }
       })}
  
 }
 

 //list of all users
 exports.allUsers = async (req,res) =>{
   User.find()
   .sort({ createdAt: -1 })
   .select('-salt')
 .select('-hashed_password')
   .exec()
   .then(users => {
  
       res.json({
         status: 1,
         result: users,
         msg: `All users fetched successfully!!!`
       });
     })
   .catch(err => {
       res.json({ status: 0, data: err, msg: " Error in fetching all users " + err });
     })
 }

 //check if sign in
 exports.requireSignin = expressJwt({
     secret: process.env.JWT_SECRET,
     userProperty: 'auth',
     algorithms: ['HS256']
 });


 //compare the token with user (To check if correct user is logged in )
exports.isAuth = (req,res,next) =>{
    // console.log(req.profile)
    // console.log(req.auth)
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
        return res.status(403).json({
          status: 0,
            msg: "Access Denied, You are not correct user, use your own token....!!"
        })
    }
    next();
}

//check if the user is admin
exports.isAdmin = (req, res, next) => {
    if (req.profile.type === 'user') {
        return res.status(403).json({
          status: 0,
          msg: "Admin resourse! Access denied!"
          
        });
    }
    next();
};


//check if the user is user
exports.isUser = (req, res, next) => {
    User.findById(req.params.UID).exec((err, user) => {
        if (err || !user) {
            return res.status(403).json({
              status: 0,
              msg: " User not found!"
            }); 
        }
        next();
    });
    
};


//Get user infro from :UID of each url
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
              status: 0,
              msg: " User not found!"
            });
        }
        if(!user.enabled){
          return res.status(400).json({
            status: 0,
            msg: "Your are blocked by admin. Please contact admin!"
          });
        }
        req.profile = user;
        next();
    });
};

//deleteUser
exports.deleteUser =async (req,res) =>{
  let user = await User.findById(req.body.BUID);
  if(user.type == 'admin'){
    res.json({ status: 0, data: null, msg: "You cannot delete admin user" })
  }else{
   user.enabled = !user.enabled;
    user.save().then(result =>{
     res.json({
       status: 1,
       result: null,
       msg: `${result.name} Blocked status : ${!result.enabled}!!!`
     });
    })
    .catch(err => {
     res.json({ status: 0, data: err, msg: " error" })
   })
  }
 
}

//contact us by user
exports.contactUs = (req, res) => {
 
  var {name,phone,email,message} = req.body;

  
  if(!name || !email || !phone || !message){
    return res.json({
      status: 0,
      msg: "Enter all data!!!"
    });
  }else{
    sendEmail(
      "public/emails/contactUs.ejs",`UserName:${name} ${"\n"}  ${"\n"}   Phone: ${phone},    ${"\n"}${"\n"}${"\n"}${"\n"} Message:${message}`,email,'Contact us from app',"Email sent to admin!",res);
       
  }
 
};