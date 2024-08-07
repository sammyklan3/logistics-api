const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadsDir = "uploads";

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Define storage for files
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads"); // Directory to save files
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file with current timestamp
    }
});

// File filter to accept pdf and photos only
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf/;
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