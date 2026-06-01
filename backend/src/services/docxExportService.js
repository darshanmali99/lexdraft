import fs from "fs";
import path from "path";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

import pool from "../config/db.js";

const EXPORTS_DIR =
  process.env.EXPORTS_DIR || "./exports";

const DEFAULT_FONT =
  process.env.DEFAULT_FONT || "Calibri";

const DEFAULT_FONT_SIZE =
  Number(process.env.DEFAULT_FONT_SIZE || 11);

/**
 * Parse AI generated legal draft into structured sections
 */
function parseGeneratedDraft(draftText) {
  const lines = draftText.split("\n");

  const sections = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Rule 4: Empty line
    if (!line) {
      continue;
    }

    // Rule 1: ALL CAPS title
    if (
      /^[A-Z\s\-&,()]+$/.test(line) &&
      line.length > 5 &&
      line.length < 120
    ) {
      sections.push({
        type: "title",
        text: line,
      });
      continue;
    }

    // Rule 2: Clause headings
    if (
      /^(\d+(\.\d+)?\.?\s)|^(CLAUSE\s+\d+)|^(SECTION\s+\d+)|^(ARTICLE\s+[IVX]+)/i.test(
        line
      )
    ) {
      sections.push({
        type: "heading",
        text: line,
        level: 1,
      });
      continue;
    }

    // Rule 3: Review flags
    if (line.includes("[REVIEW NEEDED")) {
      sections.push({
        type: "review_flag",
        text: line,
      });
      continue;
    }

    // Rule 5: Signature block
    if (
      /IN WITNESS WHEREOF|SIGNATURE|EXECUTED/i.test(
        line
      )
    ) {
      sections.push({
        type: "signature_block",
        text: line,
      });
      continue;
    }

    // Rule 6: Normal paragraph
    sections.push({
      type: "paragraph",
      text: line,
    });
  }

  console.log(
    "Parsed Draft Sections:",
    JSON.stringify(sections.slice(0, 10), null, 2)
  );

  return sections;
}

/**
 * Build professional company letterhead
 */
function buildLetterhead(companySettings) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 100,
      },
      children: [
        new TextRun({
          text: companySettings.company_name || "Company Name",
          bold: true,
          size: 28,
          font: DEFAULT_FONT,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 80,
      },
      children: [
        new TextRun({
          text:
            companySettings.company_address ||
            "",
          size: 20,
          font: DEFAULT_FONT,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "999999",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: `${companySettings.company_phone || ""
            } | ${companySettings.company_email || ""
            }`,
          size: 20,
          font: DEFAULT_FONT,
        }),
      ],
    }),
  ];
}

/**
 * Build professional signature block
 */
function buildSignatureBlock(
  companySettings,
  clientName
) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },

    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                spacing: {
                  after: 300,
                },
                children: [
                  new TextRun({
                    text: `FOR: ${companySettings.company_name}`,
                    bold: true,
                    size: 22,
                  }),
                ],
              }),

              new Paragraph("________________________"),

              new Paragraph({
                text: "Authorized Signatory",
              }),

              new Paragraph({
                text: "Date: ______________",
              }),
            ],
          }),

          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                spacing: {
                  after: 300,
                },
                children: [
                  new TextRun({
                    text: `FOR: ${clientName}`,
                    bold: true,
                    size: 22,
                  }),
                ],
              }),

              new Paragraph("________________________"),

              new Paragraph({
                text: "Authorized Signatory",
              }),

              new Paragraph({
                text: "Date: ______________",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Generate professional DOCX export
 */
async function generateDocx(
  documentRecord,
  companySettings
) {
  try {
    if (!documentRecord.generated_draft) {
      throw new Error(
        "Document has no generated draft"
      );
    }

    const parsedSections =
      parseGeneratedDraft(
        documentRecord.generated_draft
      );

    const sanitizedClientName =
      (documentRecord.client_name || "client")
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "_");

    const shortId =
      documentRecord.id.slice(0, 4);

    const dateString = new Date()
      .toISOString()
      .split("T")[0];

    const fileName =
      `lexdraft_${sanitizedClientName}_${dateString}_${shortId}.docx`;

    const filePath = path.join(
      EXPORTS_DIR,
      fileName
    );

    const children = [];

    // Letterhead
    children.push(
      ...buildLetterhead(companySettings)
    );

    // Document body
    for (const section of parsedSections) {
      switch (section.type) {
        case "title":
          children.push(
            new Paragraph({
              alignment:
                AlignmentType.CENTER,

              spacing: {
                before: 300,
                after: 300,
              },

              children: [
                new TextRun({
                  text: section.text,
                  bold: true,
                  allCaps: true,
                  size: 32,
                  font: DEFAULT_FONT,
                }),
              ],
            })
          );
          break;

        case "heading":
          children.push(
            new Paragraph({
              heading:
                HeadingLevel.HEADING_1,

              spacing: {
                before: 200,
                after: 120,
              },

              children: [
                new TextRun({
                  text: section.text,
                  bold: true,
                  size: 24,
                  font: DEFAULT_FONT,
                }),
              ],
            })
          );
          break;

        case "review_flag":
          children.push(
            new Paragraph({
              spacing: {
                before: 120,
                after: 120,
              },

              children: [
                new TextRun({
                  text: section.text,
                  bold: true,
                  color: "FF0000",
                  size: 22,
                  font: DEFAULT_FONT,
                }),
              ],
            })
          );
          break;

        case "paragraph":
          children.push(
            new Paragraph({
              alignment:
                AlignmentType.JUSTIFIED,

              spacing: {
                after: 120,
                line: 276,
              },

              children: [
                new TextRun({
                  text: section.text,
                  size:
                    DEFAULT_FONT_SIZE * 2,
                  font: DEFAULT_FONT,
                }),
              ],
            })
          );
          break;

        case "signature_block":
          children.push(
            new Paragraph({
              spacing: {
                before: 400,
                after: 200,
              },

              children: [
                new TextRun({
                  text: section.text,
                  bold: true,
                  size: 22,
                }),
              ],
            })
          );

          children.push(
            buildSignatureBlock(
              companySettings,
              documentRecord.client_name
            )
          );

          break;

        default:
          break;
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1800,
                bottom: 1440,
                left: 1800,
              },
            },
          },

          children,
        },
      ],
    });

    const buffer =
      await Packer.toBuffer(doc);

    fs.writeFileSync(filePath, buffer);

    await pool.query(
      `
      UPDATE generated_documents
      SET
        docx_path = $1,
        docx_generated_at = NOW()
      WHERE id = $2
      `,
      [filePath, documentRecord.id]
    );

    console.log(
      `DOCX generated successfully: ${filePath}`
    );

    return {
      filePath,
      fileName,
    };
  } catch (error) {
    console.error(
      "DOCX generation error:",
      error
    );

    throw error;
  }
}

export {
  parseGeneratedDraft,
  buildLetterhead,
  buildSignatureBlock,
  generateDocx,
};

export default {
  parseGeneratedDraft,
  buildLetterhead,
  buildSignatureBlock,
  generateDocx,
};