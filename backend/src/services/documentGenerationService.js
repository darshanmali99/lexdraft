import pool from "../config/db.js";

import ragService from "./ragService.js";

import promptBuilder from "./promptBuilder.js";

import groqService from "./groqService.js";


// ======================================
// GENERATE LEGAL DOCUMENT
// ======================================

export const generateLegalDocument =
async (

  formData,

  adminId

) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "STARTING DOCUMENT GENERATION"
    );

    console.log(
      "================================="
    );


    // ======================================
    // STEP 1 — VALIDATE INPUT
    // ======================================

    if (
      !formData.document_type_id
    ) {

      throw new Error(
        "document_type_id is required"
      );
    }


    if (
      !formData.client_name
    ) {

      throw new Error(
        "client_name is required"
      );
    }


    if (
      !formData.jurisdiction
    ) {

      throw new Error(
        "jurisdiction is required"
      );
    }


    // ======================================
    // STEP 2 — LOAD COMPANY SETTINGS
    // ======================================

    const companySettingsQuery =
      await pool.query(

        `
        SELECT *
        FROM company_settings
        LIMIT 1
        `
      );


    if (
      companySettingsQuery.rows
        .length === 0
    ) {

      throw new Error(

        "Company settings not configured. " +
        "Please configure via " +
        "POST /api/kb/settings"
      );
    }


    const companySettings =
      companySettingsQuery.rows[0];


    console.log(
      "Company settings loaded"
    );


    // ======================================
    // STEP 3 — LOAD DOCUMENT TYPE
    // ======================================

    const documentTypeQuery =
      await pool.query(

        `
        SELECT *
        FROM document_types
        WHERE id = $1
        LIMIT 1
        `,

        [formData.document_type_id]
      );


    if (
      documentTypeQuery.rows
        .length === 0
    ) {

      throw new Error(
        "Document type not found"
      );
    }


    const documentType =
      documentTypeQuery.rows[0];


    formData.document_type_name =
      documentType.name;


    console.log(
      "Document type loaded:",
      documentType.name
    );


    // ======================================
    // STEP 4 — BUILD SEARCH QUERY
    // ======================================

    const searchQuery =
      ragService.buildSearchQuery(
        formData
      );


    // ======================================
    // STEP 5 — RETRIEVE CLAUSES
    // ======================================

    const clauses =
      await ragService
        .retrieveRelevantClauses(

          searchQuery,

          formData.document_type_id,

          parseInt(
            process.env.RAG_TOP_K
          ) || 6
        );


    if (
      clauses.length === 0
    ) {

      throw new Error(

        "No relevant clauses found. " +
        "Please upload and embed " +
        "legal documents first."
      );
    }


    console.log(
      `${clauses.length}
       clauses retrieved`
    );


    // ======================================
    // STEP 6 — FORMAT CLAUSES
    // ======================================

    const formattedClauses =
      ragService
        .formatRetrievedClausesForPrompt(
          clauses
        );


    console.log(
      "Clauses formatted"
    );


    // ======================================
    // STEP 7 — BUILD PROMPTS
    // ======================================

    const systemPrompt =
      promptBuilder
        .buildSystemPrompt(
          companySettings
        );


    const userPrompt =
      promptBuilder
        .buildUserPrompt(

          formData,

          companySettings,

          formattedClauses
        );


    // ======================================
    // VALIDATE PROMPTS
    // ======================================

    const promptValidation =
      promptBuilder
        .validatePromptLength(

          systemPrompt,

          userPrompt
        );


    console.log(
      "Estimated prompt tokens:",
      promptValidation.totalTokens
    );


    if (
      promptValidation.warning
    ) {

      console.log(
        "Prompt warning:",
        promptValidation.warning
      );
    }


    // ======================================
    // STEP 8 — LOG GENERATION START
    // ======================================

    console.log(
      "Starting document generation:"
    );

    console.log(
      "Document type:",
      documentType.name
    );

    console.log(
      "Client:",
      formData.client_name
    );

    console.log(
      "Clauses retrieved:",
      clauses.length
    );

    console.log(
      "Sending to Groq..."
    );


    // ======================================
    // STEP 9 — GENERATE DOCUMENT
    // ======================================

    const generationResult =
      await groqService
        .generateDocument(

          systemPrompt,

          userPrompt
        );


    if (
      !generationResult.content
    ) {

      throw new Error(
        "Generated document is empty"
      );
    }


    console.log(
      "Document generated successfully"
    );


    // ======================================
    // STEP 10 — SAVE TO DATABASE
    // ======================================

    const generatedTitle =
      `${documentType.name} - ${formData.client_name}`;


    const insertQuery =
      await pool.query(

        `
        INSERT INTO generated_documents (

          document_type_id,

          document_type_name,

          title,

          client_name,

          client_address,

          client_company,

          effective_date,

          term_years,

          jurisdiction,

          special_requirements,

          extra_instructions,

          form_data,

          retrieved_chunks,

          system_prompt,

          user_prompt,

          generated_draft,

          model_used,

          tokens_used,

          generation_time_ms,

          status,

          version

        )

        VALUES (

          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20,
          $21

        )

        RETURNING *
        `,

        [

          formData.document_type_id,

          documentType.name,

          generatedTitle,

          formData.client_name,

          formData.client_address || null,

          formData.client_company || null,

          formData.effective_date || null,

          formData.term_years || null,

          formData.jurisdiction,

          formData.special_requirements || null,

          formData.extra_instructions || null,

          JSON.stringify(formData),

          JSON.stringify(clauses),

          systemPrompt,

          userPrompt,

          generationResult.content,

          generationResult.model,

          generationResult.tokens_used,

          generationResult.generation_time_ms,

          "draft",

          1
        ]
      );


    const savedDocument =
      insertQuery.rows[0];


    // ======================================
    // STEP 11 — LOG COMPLETION
    // ======================================

    console.log(
      "================================="
    );

    console.log(
      "DOCUMENT GENERATED SUCCESSFULLY"
    );

    console.log(
      "================================="
    );

    console.log(
      "Document ID:",
      savedDocument.id
    );

    console.log(
      "Tokens used:",
      generationResult.tokens_used
    );

    console.log(
      "Generation time:",
      generationResult.generation_time_ms + "ms"
    );


    // ======================================
    // STEP 12 — RETURN RESULT
    // ======================================

    return savedDocument;

  } catch (error) {

    console.error(
      "Document generation pipeline error:",
      error
    );

    throw error;
  }
};


// ======================================
// EXPORTS
// ======================================

export default {

  generateLegalDocument
};