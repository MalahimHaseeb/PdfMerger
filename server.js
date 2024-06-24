const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const multer = require('multer');
const { mergePDF } = require('./merge');
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/SideBar')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/SideBar/index.html'));
});

let mergedFileName;

app.post('/merge', upload.array('pdfs', 2), async function (req, res, next) {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).send('At least two PDF files are required.');
    }

    let a = req.files[0];
    let b = req.files[1];

    await fs.access(a.path);
    await fs.access(b.path);

    mergedFileName = await mergePDF(b.path, a.path);

    res.redirect(`/merge/pdf/${mergedFileName}`);
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).send('Error merging PDFs');
  }
});

app.get('/merge/pdf/:fileName', (req, res) => {
  const filePath = path.join(__dirname, `uploads/${req.params.fileName}`);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
