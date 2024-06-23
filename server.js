const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Import fs module for file operations
const app = express();
const multer = require('multer');
const { mergePDF } = require('./merge');
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/SideBar')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/SideBar/index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async function (req, res, next) {
  try {
    // Check if files are present
    if (!req.files || req.files.length < 2) {
      return res.status(400).send('At least two PDF files are required.');
    }

    // Proceed with merging
    let a = req.files[0];
    let b = req.files[1];

    // Ensure the files exist before merging
    await fs.access(a.path);
    await fs.access(b.path);

    await mergePDF(b.path, a.path); // Assuming Multer provides paths in 'path' property

    // Redirect to merged PDF
    res.redirect('/merge/pdf');

    // Delete the 'uploads' folder after a delay to ensure the response is sent
    setTimeout(async () => {
      try {
        await fs.rm(path.join(__dirname, 'uploads'), { recursive: true });
      } catch (err) {
        console.error('Error deleting uploads folder:', err);
      }
    }, 1000);
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).send('Error merging PDFs');
  }
});

app.use('/merge/pdf', express.static(path.join(__dirname, 'uploads/merged.pdf')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
