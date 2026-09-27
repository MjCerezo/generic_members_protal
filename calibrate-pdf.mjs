// calibrate-pdf.mjs
// Creates a calibration overlay on the blank form with numbered grid lines
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFileSync, writeFileSync } from 'fs'

const pdfBytes = readFileSync('C:/Users/mjcerezo/Desktop/RND/Forms/20231227_CLIENT MEMBERSHIP FORM.pdf')
const pdfDoc  = await PDFDocument.load(pdfBytes)
const font    = await pdfDoc.embedFont(StandardFonts.Helvetica)
const page    = pdfDoc.getPages()[0]
const { width, height } = page.getSize()
console.log('Page size:', width, 'x', height)

// Draw horizontal reference lines every 25 pts with Y label
for (let y = 25; y < height; y += 25) {
  page.drawLine({ start:{x:0,y}, end:{x:width,y}, thickness:0.3, color:rgb(1,0,0) })
  page.drawText(`y=${y}`, { x:2, y:y+1, size:5, font, color:rgb(1,0,0) })
}
// Draw vertical lines every 50 pts
for (let x = 50; x < width; x += 50) {
  page.drawLine({ start:{x,y:0}, end:{x,y:height}, thickness:0.3, color:rgb(0,0,1) })
  page.drawText(`x=${x}`, { x:x+1, y:2, size:5, font, color:rgb(0,0,1) })
}

const out = await pdfDoc.save()
writeFileSync('C:/Users/mjcerezo/Desktop/calibration-grid.pdf', out)
console.log('Saved calibration-grid.pdf to Desktop')
