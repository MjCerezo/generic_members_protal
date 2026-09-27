const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText() {
  const data = new Uint8Array(fs.readFileSync('public/membership-form.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const textContent = await page.getTextContent();
  
  for (const item of textContent.items) {
    if (item.transform[5] < 200) {
      console.log(`"${item.str}" at x: ${item.transform[4].toFixed(2)}, y: ${item.transform[5].toFixed(2)}`);
    }
  }
}

extractText().catch(console.error);
