var express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
var multer = require('multer');
const crypto = require('crypto');
var cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors())

const mongoURI = 'mongodb://localhost:27017/myapp';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.get('/',function(req,res){
    return res.send('Hello Server')
})
app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});

app.listen(5000, function() {
    console.log('App running on port 5000');
});