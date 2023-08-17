const path = require("path");

const uploadFileController = (req, res) => {
  const files = req.files;

  Object.keys(files).forEach((key) => {
    const filepath = path.join(__dirname, "..", "files", files[key].name);
    files[key].mv(filepath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });
  });

  return res.status(200).json({
    status: "success",
    message: Object.keys(files).toString(),
  });
};

module.exports = { uploadFileController };
