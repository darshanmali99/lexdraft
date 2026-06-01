import fs from "fs";
import path from "path";

import { exec } from "child_process";


// ======================================
// CONVERT DOCX TO PDF
// ======================================

const convertDocxToPdf = async (
  docxPath
) => {

  return new Promise((resolve, reject) => {

    try {

      // ======================================
      // VALIDATE FILE
      // ======================================

      if (!fs.existsSync(docxPath)) {

        return reject(
          new Error("DOCX file not found")
        );
      }

      // ======================================
      // PATHS
      // ======================================

      const absoluteDocxPath =
        path.resolve(docxPath);

      const outputDir =
        path.dirname(absoluteDocxPath);

      // ======================================
      // LIBREOFFICE HEADLESS COMMAND
      // ======================================

      const command = `
libreoffice --headless --convert-to pdf "${absoluteDocxPath}" --outdir "${outputDir}"
`;

      console.log(
        "Running PDF conversion:"
      );

      console.log(command);

      // ======================================
      // EXECUTE COMMAND
      // ======================================

      exec(
        command,

        (error, stdout, stderr) => {

          if (error) {

            console.error(
              "PDF conversion failed:"
            );

            console.error(error);

            return reject(error);
          }

          if (stderr) {

            console.log(
              "LibreOffice stderr:"
            );

            console.log(stderr);
          }

          console.log(
            "LibreOffice stdout:"
          );

          console.log(stdout);

          // ======================================
          // BUILD PDF PATH
          // ======================================

          const pdfPath =
            absoluteDocxPath.replace(
              /\.docx$/,
              ".pdf"
            );

          // ======================================
          // VERIFY PDF EXISTS
          // ======================================

          if (!fs.existsSync(pdfPath)) {

            return reject(
              new Error(
                "PDF file was not generated"
              )
            );
          }

          console.log(
            "PDF generated successfully:"
          );

          console.log(pdfPath);

          resolve(pdfPath);
        }
      );

    } catch (error) {

      reject(error);
    }
  });
};


// ======================================
// EXPORTS
// ======================================

export {
  convertDocxToPdf
};

export default {
  convertDocxToPdf
};