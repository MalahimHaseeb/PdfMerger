const PDFMerger = require('pdf-merger-js');

var merger = new PDFMerger();

const mergePDF = async (a,b) => {
  merger.add(a);  //merge all pages. parameter is the path to file and filename.
  merger.add(b);

  await merger.save('uploads/merged.pdf'); //save under given name and reset the internal document
};

module.exports = { mergePDF };