var cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dakpa1ph2', 
    api_key: '673349351367834', 
    api_secret: '1-hHFpL6ne2iPqtiOaOG1puI-wU' 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };
  
  const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  module.exports = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  
  module.exports.uploadMultipleImages = (images) => {
    return new Promise((resolve, reject) => {
      const uploads = images.map((base) => uploadImage(base));
      Promise.all(uploads)
        .then((values) => resolve(values))
        .catch((err) => reject(err));
    });
  };