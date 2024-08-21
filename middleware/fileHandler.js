const multer = require("multer");
const path = require("path");
const https = require("https");
const axios = require("axios");
const fs = require("fs");
const uploadsDir = "uploads";

// Define the URL of the image and the upload directory
const imageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log(`Directory ${uploadsDir} created!`);
}

// Download the default profile picture
async function downloadImage(url, filepath) {
    const writer = fs.createWriteStream(filepath);

    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", (error) => reject(error));
    });
}

// Save the image in the uploads folder
const defaultFileName = "default.jpg";
const filePath = path.join(uploadsDir, defaultFileName);

// Check if the default profile picture already exists
if (!fs.existsSync(filePath)) {
    downloadImage(imageUrl, filePath)
       .then(() => console.log('Image downloaded successfully'))
       .catch((err) => console.error('Error downloading the image:', err));
}

// Define storage for files
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, uploadsDir); // Directory to save files
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file with current timestamp
    }
});

// File filter to accept pdf and photos only
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File type not supported!');
    }
};

// Initialize multer instance with storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
    fileFilter: fileFilter
});

module.exports = upload;