
var ejs = require("ejs")
const nodemailer = require('nodemailer'); 
 

exports.sendEmail = (templatePath,url,recieverEmail,subject,successResponse,res) =>{

     //mail transport credentials
     let mailTransporter = nodemailer.createTransport({ 
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, 
        auth: { 
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        } 
    }); 

    //email template while signup
ejs.renderFile(templatePath, {email:recieverEmail, url : url},(err,data) =>{
  if(err){
    return res.json({
      status : 0,
      result : err,
      msg : "Error occurs " + err
  });
  }else{
    let mailDetails = { 
      from: process.env.SENDER_EMAIL, 
      to: recieverEmail, 
      subject: subject, 
      html:   data
    }; 
 
    //send email using mail transport
mailTransporter.sendMail(mailDetails)
.then(sent => {
  return res.json({
      status : 1,
      result : sent,
      msg : successResponse
  });
})
.catch(err => {
  console.log(err)
  return res.json({
      status : 0,
      result : null,
      msg : ` Error in   ${err}`
  });
});


  }
}) 


}
