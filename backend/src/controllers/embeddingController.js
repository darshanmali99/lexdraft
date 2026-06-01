import pool from "../config/db.js";

import {

  embedAllPendingChunks,

  semanticSearch

} from "../services/embeddingService.js";


// ======================================
// START EMBEDDING JOB
// ======================================

export const startEmbeddingJob =
async (req, res) => {

  try {

    // ======================================
    // CREATE JOB RECORD
    // ======================================

    const jobResult =
      await pool.query(

        `
        INSERT INTO embedding_jobs
        (
          status,
          total_chunks,
          processed_chunks,
          failed_chunks
        )
        VALUES
        (
          'pending',
          0,
          0,
          0
        )
        RETURNING *
        `
      );


    const job =
      jobResult.rows[0];


    // ======================================
    // START EMBEDDING PIPELINE
    // ======================================

    embedAllPendingChunks(
      job.id
    ).catch(console.error);


    res.status(201).json({

      success: true,

      message:
        "Embedding job started",

      data: job
    });

  } catch (error) {

    console.error(
      "Start embedding job error:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// GET JOB STATUS
// ======================================

export const getEmbeddingJobStatus =
async (req, res) => {

  try {

    const { id } = req.params;

    const result =
      await pool.query(

        `
        SELECT *
        FROM embedding_jobs
        WHERE id = $1
        `,

        [id]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Embedding job not found"
      });
    }


    res.json({

      success: true,

      data: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Get embedding job status error:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// SEMANTIC SEARCH API
// ======================================

export const searchEmbeddings =
async (req, res) => {

  try {

    const {

      query,

      document_type_id,

      top_k

    } = req.body;


    if (!query) {

      return res.status(400).json({

        success: false,

        message:
          "Search query is required"
      });
    }


    const results =
      await semanticSearch(

        query,

        document_type_id || null,

        top_k || 5
      );


    res.json({

      success: true,

      total_matches:
        results.length,

      data: results
    });

  } catch (error) {

    console.error(
      "Semantic search API error:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// EMBEDDING STATS
// ======================================

export const getEmbeddingStats =
async (req, res) => {

  try {

    const stats =
      await pool.query(

        `
        SELECT

          COUNT(*) AS total_chunks,

          COUNT(*) FILTER (
            WHERE is_embedded = true
          ) AS embedded_chunks,

          COUNT(*) FILTER (
            WHERE is_embedded = false
          ) AS pending_chunks

        FROM document_chunks
        `
      );


    res.json({

      success: true,

      data: stats.rows[0]
    });

  } catch (error) {

    console.error(
      "Embedding stats error:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};