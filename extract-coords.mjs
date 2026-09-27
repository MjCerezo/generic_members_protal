// extract-coords.mjs — uses pdf-lib to overlay COLUMNA_CHONA data on blank form with markers
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { readFileSync, writeFileSync } from 'fs'

// Load the reference filled form to understand its coordinate space
const refBytes  = readFileSync('C:/Users/mjcerezo/Desktop/RND/Forms/COLUMNA_CHONA.pdf')
const blankBytes = readFileSync('C:/Users/mjcerezo/Desktop/RND/Forms/20231227_CLIENT MEMBERSHIP FORM.pdf')

// We'll work on the blank form and overlay calibration markers to match the reference visually
const pdfDoc = await PDFDocument.load(blankBytes)
const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
const page   = pdfDoc.getPages()[0]
const { width, height } = page.getSize()
console.log('Page:', width, 'x', height)

// From visual inspection of COLUMNA_CHONA.pdf vs the blank form,
// map each reference text to its approximate Y position
// We draw sample text at those positions to verify

const fields = [
  // Personal
  { label: 'Surname',     x: 100, y: 636, text: 'CEREZO' },
  { label: 'FirstName',   x: 245, y: 636, text: 'MARJUN' },
  { label: 'MiddleName',  x: 390, y: 636, text: 'TEST' },
  { label: 'MaleBox',     x: 134, y: 623, text: 'X' },
  { label: 'DOB',         x: 133, y: 609, text: '01/01/2000' },
  { label: 'Single',      x: 329, y: 609, text: 'X' },
  { label: 'Married',     x: 432, y: 609, text: 'X' },
  // Address
  { label: 'PresentAddr', x: 100, y: 578, text: '1, 2, 3, Poblacion, Dagohoy, Bohol, 6322' },
  { label: 'PermAddr',    x: 100, y: 554, text: '1, 2, 3, Poblacion, Dagohoy, Bohol, 6322' },
  // Contact
  { label: 'Mobile',      x: 130, y: 535, text: '+639239239239' },
  { label: 'HomePhone',   x: 320, y: 535, text: '' },
  { label: 'BPI',         x: 130, y: 521, text: '6434-3243-24' },
  { label: 'SA',          x: 209, y: 523, text: 'X' },
  { label: 'Position',    x: 360, y: 521, text: 'Test Position' },
  { label: 'SSS',         x: 130, y: 509, text: '7234324234' },
  { label: 'TIN',         x: 130, y: 483, text: '93424323423' },
  // Employment
  { label: 'Company',     x: 130, y: 471, text: 'University Of Nueva Caceres' },
  { label: 'OfficeEmail', x: 340, y: 471, text: 'marjuncerezo6@gmail.com' },
  { label: 'OfficeAddr',  x: 100, y: 458, text: 'Cavite, Alfonso' },
  { label: 'EmpID',       x: 130, y: 445, text: '13123' },
  { label: 'PersonalEmail',x:340, y: 445, text: 'marjuncerezo6@gmail.com' },
  { label: 'DateHired',   x: 130, y: 432, text: '01/01/2000' },
  { label: 'OfficePhone', x: 340, y: 432, text: '' },
  // Application type
  { label: 'NewMember',   x: 120, y: 406, text: 'X' },
  // Capital pledge — P200 custom
  { label: 'CustomBox',   x: 253, y: 330, text: 'X' },
  { label: 'Amount',      x: 270, y: 330, text: 'P200' },
  // Beneficiaries
  { label: 'Ben1Name',    x:  55, y: 220, text: 'Beneficiary 1, Beneficiary 1, Beneficiary 1' },
  { label: 'Ben1DOB',     x: 285, y: 220, text: '01/01/1900' },
  { label: 'Ben1Rel',     x: 395, y: 220, text: '1' },
  { label: 'Ben2Name',    x:  55, y: 207, text: 'Beneficiary 2, Beneficiary 2, Beneficiary 2' },
  { label: 'Ben2DOB',     x: 285, y: 207, text: '01/01/2000' },
  { label: 'Ben2Rel',     x: 395, y: 207, text: '1' },
]

for (const f of fields) {
  page.drawText(f.text, { x: f.x, y: f.y, size: 7.5, font, color: rgb(0.8, 0, 0) })
}

const out = await pdfDoc.save()
writeFileSync('C:/Users/mjcerezo/Desktop/test-fill.pdf', out)
console.log('Saved test-fill.pdf to Desktop — open to compare with COLUMNA_CHONA.pdf')
