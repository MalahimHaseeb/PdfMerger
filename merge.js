const PDFMerger = require('pdf-merger-js');

const mergePDF = async (a, b) => {
  const merger = new PDFMerger();
  merger.add(a);
  merger.add(b);

  const d = new Date().getTime();
  const fileName = `${d}.pdf`;
  await merger.save(`uploads/${fileName}`);
  return fileName;
};

module.exports = { mergePDF };
