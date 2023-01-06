const fs = require("fs");
const path = require("path")

const deleteImage = (imagePath) => {
  const imageDir = path.join(__dirname, "../", "images", imagePath)
  fs.unlink(imageDir, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = deleteImage;
