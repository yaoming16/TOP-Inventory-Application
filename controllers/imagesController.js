const path = require("node:path");

function getImages(req, res) {
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "images",
    `${req.params.id}.webp`,
  );

  res.sendFile(imagePath);
}

module.exports = { getImages };
