const path = require("path");
const fs = require("fs");

async function deleteFile(filename) {
  const filePath = path.resolve(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
  } else {
    console.log("File not found");
  }
}

module.exports = deleteFile;
