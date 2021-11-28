const multer = require("multer");
const path = require("path");
const slugGenerator = require("./slugGenerator");
uuidv4 = require('uuid/v4');


    module.exports = function(destn) {
      try {
        const storage = multer.diskStorage({
          // Absolute path
          destination: function(req, file, callback) {
            callback(null, path.join("public/") + destn);
          },

             // Match the field name in the request body
           filename: function(req, file, callback) {
  
      callback(
        null,
        //rename file in server as its title and uuid text
        slugGenerator(req.body.title)+"-"+uuidv4() + path.extname(file.originalname)
      );
    }
        });
    
        const fileFilter = (req, file, cb) => {
          // reject a file
          if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
          } else {
            cb(null, false);
          }
        };
    
        const upload = multer({
          storage: storage,
          limits: {
            fileSize: 1024 * 1024 * 5
          },
          fileFilter: fileFilter
        });
        return upload;
      } catch (ex) {
        console.log("Error :\n" + ex);
      }
    };
 

