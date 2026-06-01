import fs from "fs";
import mammoth from "mammoth";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


// ======================================
// EXTRACT TEXT FROM PDF
// ======================================

export const extractPdfText = async (filePath) => {

  try {

    const data = new Uint8Array(
      fs.readFileSync(filePath)
    );

    const pdf = await pdfjsLib.getDocument({
      data
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const strings = content.items.map(
        item => item.str
      );

      text += strings.join(" ") + "\n";
    }

    return text;

  } catch (error) {

    console.error("PDF extraction error:", error);

    throw new Error("Failed to extract PDF text");
  }
};


// ======================================
// EXTRACT TEXT FROM DOCX
// ======================================

export const extractDocxText = async (filePath) => {

  try {

    const result = await mammoth.extractRawText({
      path: filePath
    });

    return result.value;

  } catch (error) {

    console.error("DOCX extraction error:", error);

    throw new Error("Failed to extract DOCX text");
  }
};


// ======================================
// MAIN FILE EXTRACTOR
// ======================================

const extractText = async (filePath, fileType) => {

  switch (fileType.toLowerCase()) {

    case "pdf":
      return await extractPdfText(filePath);

    case "docx":
      return await extractDocxText(filePath);

    default:
      throw new Error("Unsupported file type");
  }
};


export default extractText;