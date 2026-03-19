const cloudinary = require("cloudinary").v2;

const CLOUDINARY_FOLDER = "inventory_games";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

function uploadToCloudinary(fileBuffer, imageName) {
  return new Promise((resolve, reject) => {
    const options = { folder: CLOUDINARY_FOLDER };
    if (imageName) {
      options.public_id = imageName;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
}

function extractImgName(imgURL) {
  return imgURL.split("/").pop().split(".")[0];
}

async function deleteCloudinaryImg(imgURL) {
  const imgName = `${CLOUDINARY_FOLDER}/${extractImgName(imgURL)}`;


  try {
    const result = await cloudinary.uploader.destroy(imgName, {
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Image deletion failed");
  }
}

module.exports = {
  uploadToCloudinary,
  extractImgName,
  deleteCloudinaryImg
}
