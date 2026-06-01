import {
  semanticSearch
} from "./embeddingService.js";

import pool from "../config/db.js";


// ======================================
// BUILD SEMANTIC SEARCH QUERY
// ======================================

export const buildSearchQuery = (
  formData
) => {

  try {

    const searchParts = [];


    // ======================================
    // DOCUMENT TYPE
    // ======================================

    if (formData.document_type_name) {

      searchParts.push(
        formData.document_type_name
      );
    }


    // ======================================
    // JURISDICTION
    // ======================================

    if (formData.jurisdiction) {

      searchParts.push(
        formData.jurisdiction
      );
    }


    // ======================================
    // TERM LENGTH
    // ======================================

    if (formData.term_years) {

      searchParts.push(
        `${formData.term_years} year term`
      );
    }


    // ======================================
    // SPECIAL REQUIREMENTS
    // ======================================

    if (
      formData.special_requirements
    ) {

      searchParts.push(
        formData.special_requirements
      );
    }


    // ======================================
    // EXTRA INSTRUCTIONS
    // ======================================

    if (
      formData.extra_instructions
    ) {

      searchParts.push(
        formData.extra_instructions
      );
    }


    // ======================================
    // DEFAULT LEGAL TERMS
    // ======================================

    searchParts.push(
      "legal agreement"
    );

    searchParts.push(
      "confidentiality obligations"
    );

    searchParts.push(
      "contract clauses"
    );


    // ======================================
    // FINAL QUERY
    // ======================================

    const finalQuery =
      searchParts.join(" ");

    console.log(
      "Generated semantic query:"
    );

    console.log(finalQuery);

    return finalQuery;

  } catch (error) {

    console.error(
      "Search query build error:",
      error
    );

    throw error;
  }
};


// ======================================
// RETRIEVE RELEVANT CLAUSES
// ======================================

export const retrieveRelevantClauses =
async (

  searchQuery,

  documentTypeId = null,

  topK = 6

) => {

  try {

    console.log(
      "Starting clause retrieval..."
    );

    console.log(
      "Search query:",
      searchQuery
    );


    // ======================================
    // RUN SEMANTIC SEARCH
    // ======================================

    const results =
      await semanticSearch(

        searchQuery,

        documentTypeId,

        topK
      );


    // ======================================
    // MINIMUM SIMILARITY
    // ======================================

    const minSimilarity =
      parseFloat(
        process.env
          .RAG_MIN_SIMILARITY
      ) || 0.45;


    // ======================================
    // FILTER WEAK MATCHES
    // ======================================

    const filteredResults =
      results.filter(

        chunk =>
          chunk.similarity_score >=
          minSimilarity
      );


    console.log(
      `${filteredResults.length}
       relevant clauses after filtering`
    );


    // ======================================
    // ENRICH RESULTS
    // ======================================

    const enrichedResults = [];

    for (const chunk of filteredResults) {

      const metadataQuery =
        await pool.query(

          `
          SELECT
            dt.name AS document_type_name,
            t.name AS source_file
          FROM document_chunks dc

          LEFT JOIN document_types dt
            ON dc.document_type_id = dt.id

          LEFT JOIN templates t
            ON dc.source_id = t.id

          WHERE dc.id = $1
          `,

          [chunk.id]
        );


      const metadata =
        metadataQuery.rows[0] || {};


      enrichedResults.push({

        chunk_id: chunk.id,

        content: chunk.content,

        chunk_index:
          chunk.chunk_index,

        word_count:
          chunk.word_count,

        document_type_id:
          chunk.document_type_id,

        section_heading:
          `Clause ${
            chunk.chunk_index + 1
          }`,

        similarity_score:
          Number(
            chunk.similarity_score
          ).toFixed(4),

        source_file:
          metadata.source_file ||
          "Unknown",

        document_type_name:
          metadata.document_type_name ||
          "Unknown"
      });
    }


    console.log(
      "Clause retrieval complete"
    );

    return enrichedResults;

  } catch (error) {

    console.error(
      "Clause retrieval error:",
      error
    );

    throw error;
  }
};


// ======================================
// FORMAT CLAUSES FOR PROMPT
// ======================================

export const
formatRetrievedClausesForPrompt =
(chunks) => {

  try {

    if (
      !chunks ||
      chunks.length === 0
    ) {

      return "No clauses retrieved.";
    }


    let formattedText = "";


    chunks.forEach(

      (chunk, index) => {

        formattedText += `

CLAUSE ${index + 1}
[${chunk.section_heading}]

${chunk.content}

`;
      }
    );


    console.log(
      `${chunks.length}
       clauses formatted for prompt`
    );

    return formattedText.trim();

  } catch (error) {

    console.error(
      "Clause formatting error:",
      error
    );

    throw error;
  }
};


// ======================================
// EXPORTS
// ======================================

export default {

  buildSearchQuery,

  retrieveRelevantClauses,

  formatRetrievedClausesForPrompt
};