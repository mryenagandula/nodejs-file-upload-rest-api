const express = require('express');
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require('cors');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        return cb(null, `${file.originalname.replace(extname,'')}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100 /** Accepts maximum 100 MB Data */
    }
})
app.use(cors()); //enabling for all origins
app.use('/uploaded-file-details', express.static('upload/images'));
app.post("/upload", upload.single('file'), (req, res) => {
    const host = req.headers.host || "http://localhost:4000"
    res.json({
        success: 200,
        message: "File uploaded successfully",
        filename: req.file.filename,
        download_url: `${host}/uploaded-file-details/${req.file.filename}`
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 500,
            message: err.message,
            filename: req.file.filename,
        })
    }
}
app.use(errHandler);

app.listen(4000, () => {
    console.log("server up and running");
})