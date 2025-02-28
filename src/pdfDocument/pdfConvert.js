'use server';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

console.log('pdfFonts:', pdfFonts);

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { writeFileSync } from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { window } = new JSDOM('');
import htmlToPdfMake from 'html-to-pdfmake';

async function CreatePdf(textHtml, filePath) {
  let html = htmlToPdfMake(textHtml, { window: window });
  let docDefinition = {
    content: [html]
  };
  let pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBuffer(function (buffer) {
    writeFileSync(filePath, buffer);
  });
}

export default CreatePdf;
