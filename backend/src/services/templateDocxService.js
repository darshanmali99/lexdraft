import fs from "fs";
import path from "path";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";


// ======================================
// GENERATE TEMPLATE DOCX
// ======================================

const generateTemplateDocx =
async (
  documentRecord
) => {

  try {

    // ======================================
    // TEMPLATE PATH
    // ======================================

    const templatePath =
      path.resolve(
        "templates/swadil-letterhead-clean.docx"
      );

    // ======================================
    // VERIFY TEMPLATE EXISTS
    // ======================================

    if (
      !fs.existsSync(templatePath)
    ) {

      throw new Error(
        "Template file not found"
      );
    }

    // ======================================
    // LOAD TEMPLATE
    // ======================================

    const content =
      fs.readFileSync(
        templatePath,
        "binary"
      );

    const zip =
      new PizZip(content);

    const doc =
      new Docxtemplater(
        zip,
        {
          paragraphLoop: true,
          linebreaks: true
        }
      );

    // ======================================
    // PLACEHOLDER DATA
    // ======================================

doc.render({

  document_title:
    documentRecord.title ||

    "Legal Agreement",

  agreement_date:
    new Date(
      documentRecord.created_at
    ).toLocaleDateString(),

  client_name:
    documentRecord.client_name ||

    "Client",

  document_body:
    documentRecord.generated_draft ||

    "No draft available"
});

    // ======================================
    // OUTPUT FILE
    // ======================================

    const outputPath =
      path.resolve(
        "exports/template-test.docx"
      );

    const buffer =
      doc.getZip().generate({

        type: "nodebuffer",

        compression: "DEFLATE"
      });

    fs.writeFileSync(
      outputPath,
      buffer
    );

    console.log(
      "Template DOCX generated:"
    );

    console.log(outputPath);

    return outputPath;

  } catch (error) {

    console.error(
      "Template DOCX error:"
    );

    console.error(error);

    throw error;
  }
};


// ======================================
// EXPORTS
// ======================================

export {
  generateTemplateDocx
};

export default {
  generateTemplateDocx
};