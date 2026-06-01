import pool from "../config/db.js";

import extractText from "./textExtractor.js";
import cleanText from "./textCleaner.js";
import chunkText from "./documentChunker.js";


// ======================================
// PROCESS TEMPLATE FILE
// ======================================

const processTemplate = async (template) => {

  try {

    console.log("Starting file processing...");


    // ======================================
    // EXTRACT RAW TEXT
    // ======================================

    const rawText = await extractText(
      template.file_path,
      template.file_type
    );


    // ======================================
    // CLEAN TEXT
    // ======================================

    const cleanedText = cleanText(rawText);
    console.log("\n========== CLEANED TEXT SAMPLE ==========\n");

console.log(
  cleanedText.substring(0, 3000)
);

console.log("\n=========================================\n");


    // ======================================
    // CREATE CHUNKS
    // ======================================

    const chunks = chunkText(cleanedText);


    console.log(`Generated ${chunks.length} chunks`);


    // ======================================
    // STORE CHUNKS
    // ======================================

    for (const chunk of chunks) {

      await pool.query(

        `
        INSERT INTO document_chunks (

          source_type,
          source_id,
          document_type_id,

          chunk_index,
          total_chunks,

          content,
          word_count

        )

        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,

        [
          "template",

          template.id,

          template.document_type_id,

          chunk.chunk_index,

          chunks.length,

          chunk.content,

          chunk.word_count
        ]
      );
    }


    // ======================================
    // UPDATE TEMPLATE STATUS
    // ======================================

    await pool.query(

      `
      UPDATE templates
      SET

        status = 'processed',

        processed_at = CURRENT_TIMESTAMP,

        chunk_count = $1

      WHERE id = $2
      `,

      [
        chunks.length,
        template.id
      ]
    );


    console.log("Processing completed successfully");


    return {
      success: true,
      chunk_count: chunks.length
    };

  } catch (error) {

    console.error("File processing error:", error);


    await pool.query(

      `
      UPDATE templates
      SET status = 'failed'
      WHERE id = $1
      `,

      [template.id]
    );


    throw error;
  }
};


export default processTemplate; 