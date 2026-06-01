import { pipeline } from "@xenova/transformers";
import pool from "../config/db.js";


// ======================================
// MODEL CACHE
// ======================================

let embeddingModel = null;


// ======================================
// LOAD EMBEDDING MODEL
// ======================================

export const initializeEmbeddingModel = async () => {

  try {

    if (embeddingModel) {

      console.log(
        "Embedding model already loaded"
      );

      return embeddingModel;
    }

    console.log(
      "Loading embedding model for first time..."
    );

    embeddingModel = await pipeline(

      "feature-extraction",

      process.env.EMBEDDING_MODEL
    );

    console.log(
      "Embedding model loaded successfully"
    );

    return embeddingModel;

  } catch (error) {

    console.error(
      "Model initialization error:",
      error
    );

    throw error;
  }
};


// ======================================
// GENERATE SINGLE EMBEDDING
// ======================================

export const generateEmbedding =
async (text) => {

  try {

    if (!text || text.trim() === "") {

      throw new Error(
        "Text cannot be empty"
      );
    }

    const model =
      await initializeEmbeddingModel();

    const output = await model(text, {

      pooling: "mean",

      normalize: true
    });

    return Array.from(output.data);

  } catch (error) {

    console.error(
      "Embedding generation error:",
      error
    );

    throw error;
  }
};


// ======================================
// GENERATE BATCH EMBEDDINGS
// ======================================

export const generateEmbeddingsBatch =
async (textsArray) => {

  try {

    const embeddings = [];

    const batchSize =
      parseInt(
        process.env.EMBEDDING_BATCH_SIZE
      ) || 10;


    for (
      let i = 0;
      i < textsArray.length;
      i += batchSize
    ) {

      const batch =
        textsArray.slice(i, i + batchSize);

      console.log(
        `Processing batch ${
          (i / batchSize) + 1
        } of ${
          Math.ceil(
            textsArray.length / batchSize
          )
        }`
      );

      for (const text of batch) {

        if (
          !text ||
          text.trim() === ""
        ) {

          console.log(
            "Skipping empty text"
          );

          continue;
        }

        const embedding =
          await generateEmbedding(text);

        embeddings.push(embedding);
      }
    }

    return embeddings;

  } catch (error) {

    console.error(
      "Batch embedding error:",
      error
    );

    throw error;
  }
};


// ======================================
// EMBED ALL PENDING CHUNKS
// ======================================

export const embedAllPendingChunks =
async (jobId) => {

  try {

    console.log(
      "Starting embedding pipeline..."
    );


    // ======================================
    // FETCH PENDING CHUNKS
    // ======================================

    const pendingChunks =
      await pool.query(

        `
        SELECT
          id,
          content
        FROM document_chunks
        WHERE is_embedded = false
        ORDER BY created_at ASC
        `
      );


    const chunks =
      pendingChunks.rows;

    const total =
      chunks.length;


    console.log(
      `${total} chunks found`
    );


    // ======================================
    // UPDATE JOB STATUS
    // ======================================

    await pool.query(

      `
      UPDATE embedding_jobs
      SET
        status = 'processing',
        total_chunks = $1,
        started_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,

      [total, jobId]
    );


    let processed = 0;

    let failed = 0;


    // ======================================
    // PROCESS CHUNKS
    // ======================================

    for (const chunk of chunks) {

      try {

        // ======================================
        // VALIDATE CONTENT
        // ======================================

        const text = chunk.content;

        if (
          !text ||
          text.trim() === ""
        ) {

          console.log(
            `Skipping empty chunk:
             ${chunk.id}`
          );

          continue;
        }


        // ======================================
        // GENERATE EMBEDDING
        // ======================================

        const embedding =
          await generateEmbedding(
            text
          );


        // ======================================
        // STORE VECTOR
        // ======================================

        await pool.query(

          `
          UPDATE document_chunks
          SET
            embedding = $1,
            is_embedded = true
          WHERE id = $2
          `,

          [
            `[${embedding.join(",")}]`,
            chunk.id
          ]
        );


        processed++;

        console.log(
          `Embedded chunk ${processed}/${total}`
        );


        // ======================================
        // UPDATE JOB PROGRESS
        // ======================================

        await pool.query(

          `
          UPDATE embedding_jobs
          SET
            processed_chunks = $1
          WHERE id = $2
          `,

          [processed, jobId]
        );

      } catch (error) {

        failed++;

        console.error(
          `Chunk embedding failed:
           ${chunk.id}`,
          error
        );


        await pool.query(

          `
          UPDATE embedding_jobs
          SET
            failed_chunks = $1
          WHERE id = $2
          `,

          [failed, jobId]
        );
      }
    }


    // ======================================
    // COMPLETE JOB
    // ======================================

    await pool.query(

      `
      UPDATE embedding_jobs
      SET
        status = 'completed',
        completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,

      [jobId]
    );


    console.log(
      `Embedding complete:
       ${processed} processed,
       ${failed} failed`
    );


    return {

      total,

      processed,

      failed
    };

  } catch (error) {

    console.error(
      "Embedding pipeline error:",
      error
    );


    await pool.query(

      `
      UPDATE embedding_jobs
      SET
        status = 'failed',
        error_message = $1
      WHERE id = $2
      `,

      [
        error.message,
        jobId
      ]
    );

    throw error;
  }
};


// ======================================
// SEMANTIC SEARCH
// ======================================

export const semanticSearch = async (

  queryText,

  documentTypeId = null,

  topK = 5

) => {

  try {

    console.log(
      "Generating query embedding..."
    );


    // ======================================
    // GENERATE QUERY VECTOR
    // ======================================

    const queryEmbedding =
      await generateEmbedding(queryText);


    let query = `

      SELECT

        dc.id,

        dc.content,

        dc.chunk_index,

        dc.word_count,

        dc.document_type_id,

        1 - (
          dc.embedding <=> $1
        ) AS similarity_score

      FROM document_chunks dc

      WHERE dc.is_embedded = true
    `;


    const values = [
      `[${queryEmbedding.join(",")}]`
    ];


    // ======================================
    // OPTIONAL FILTER
    // ======================================

    if (documentTypeId) {

      query += `
        AND dc.document_type_id = $2
      `;

      values.push(documentTypeId);
    }


    // ======================================
    // ORDER + LIMIT
    // ======================================

    query += `

      ORDER BY dc.embedding <=> $1

      LIMIT ${topK}
    `;


    const results =
      await pool.query(
        query,
        values
      );


    console.log(
      `${results.rows.length}
       semantic matches found`
    );


    return results.rows;

  } catch (error) {

    console.error(
      "Semantic search error:",
      error
    );

    throw error;
  }
};