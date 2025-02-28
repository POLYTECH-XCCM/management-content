'use server';
import { writeFile } from 'fs';
import HTMLtoDOCX from 'html-to-docx';

async function CreateDocx(htmlString, filePath) {
  const fileBuffer = await HTMLtoDOCX(htmlString, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true
  });

  writeFile(filePath, fileBuffer, (error) => {
    if (error) {
      console.log('Docx file creation failed');
      return;
    }
    console.log('Docx file created successfully');
  });
}

export default CreateDocx;
