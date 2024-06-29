const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = 'uploads';
      if (file.fieldname === 'img') {
        uploadPath = 'uploads/images';
      } else if (file.fieldname === 'video') {
        uploadPath = 'uploads/video';
      } else {
        uploadPath = 'uploads';
      }

      if (file.mimetype.startsWith('image/') || file.mimetype === 'video/mp4') {
        cb(null, uploadPath);
      } else {
        cb(new Error('Invalid file type'));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedFilenames = ['img', 'video'];
    if (file.fieldname === undefined) {
      cb(null, true);
    } else if (allowedFilenames.includes(file.fieldname)) {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const maxVideoLength = 60; // Maximum video length in seconds

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'img', maxCount: 4 },
    { name: 'video', maxCount: 1 },
  ]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).send(err.message);
      }

      const videoFile = req.files.video ? req.files.video[0] : null;

      if (videoFile) {
        const filePath = videoFile.path;
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
            return res.status(500).send('Error processing video.');
          }

          const duration = metadata.format.duration;

          if (duration > maxVideoLength) {
            return res.status(400).send('Video is too long.');
          }

          next();
        });
      } else {
        next();
      }
    });
  };
};





const express = require('express');
const mongoose = require('mongoose');
const { uploadFile } = require('./uploadFile');
const app = express();

mongoose.connect('mongodb://localhost:27017/uploadsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const fileSchema = new mongoose.Schema({
  filePath: String,
  fileType: String,
});

const File = mongoose.model('File', fileSchema);

const upload = uploadFile();

// API for uploading a video
app.post('/upload-video', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (req.files.video) {
      const videoFile = req.files.video[0];
      const newFile = new File({ filePath: videoFile.path, fileType: 'video' });
      await newFile.save();
      res.send('Video uploaded successfully.');
    }
  });
});

// API for uploading a single image
app.post('/upload-image', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (req.files.img) {
      const imageFile = req.files.img[0];
      const newFile = new File({ filePath: imageFile.path, fileType: 'image' });
      await newFile.save();
      res.send('Image uploaded successfully.');
    }
  });
});

// API for uploading multiple images
app.post('/upload-multiple-images', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (req.files.img) {
      const imageFiles = req.files.img;
      const filePromises = imageFiles.map(file => {
        const newFile = new File({ filePath: file.path, fileType: 'image' });
        return newFile.save();
      });
      await Promise.all(filePromises);
      res.send('Images uploaded successfully.');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
