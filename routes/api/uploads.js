const express = require("express");
const fileUpload = require("express-fileupload");

const router = express.Router();

const filesPayloadExists = require("../../middlewares/filesPayloadExists");
const fileExtLimiter = require("../../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../../middlewares/fileSizeLimiter");
const uploadFileController = require("../../controllers/uploadFileController");

router
  .route("/")
  .post(
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    uploadFileController.uploadFileController
  );

module.exports = router;
