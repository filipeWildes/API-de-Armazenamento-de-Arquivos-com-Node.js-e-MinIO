const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage
});

const fileController = require('../controllers/fileController');

//console.log(fileController);
//console.log('deleteFile =', fileController.deleteFile);

router.post(
  '/upload',
  upload.single('arquivo'),
  fileController.uploadFile
);

router.get(
  '/files',
  fileController.listFiles
);

router.delete(
  '/files/:name',
  fileController.deleteFile
);

module.exports = router;