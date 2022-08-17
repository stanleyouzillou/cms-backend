const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    );
  }
};

const photoUploadMiddleware = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  fileLimit: 1000000,
});

function resizePhotoMiddleware(imgCat) {
  let sizeImg;
  let folder;
  switch (imgCat) {
    case 'PROFILE':
      sizeImg = [250, 250];
      folder = 'profiletmp';
      break;
    case 'POST':
      sizeImg = [500, 500];
      folder = 'blogtmp';
      break;
  }

  return async function (req, res, next) {
    if (!req.file) return next();
    req.file.filename = `${req.user.firstName}-${Date.now()}-${
      req.file.originalname
    }`;
    await sharp(req.file.buffer)
      .resize(...sizeImg)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(
        path.join(
          __dirname,
          '..',
          'public',
          'images',
          folder,
          req.file.filename
        )
      );

    next();
  };
}

module.exports = { photoUploadMiddleware, resizePhotoMiddleware };
