import pool from "../config/db.js";

import documentGenerationService
from "../services/documentGenerationService.js";

import groqService
from "../services/groqService.js";

import {
  fetchAllDocuments,
  fetchDocumentById
} from "../services/documentQueryService.js";

import docxExportService
from "../services/docxExportService.js";

import pdfExportService
from "../services/pdfExportService.js";


// ======================================
// GENERATE DOCUMENT
// ======================================

export const generateDocument =
async (req, res) => {

  try {

    const formData = req.body;

    const adminId =
      req.user?.id || null;

    const document =
      await documentGenerationService
        .generateLegalDocument(
          formData,
          adminId
        );

    return res.status(201).json({

      success: true,

      message:
        "Document generated successfully",

      document
    });

  } catch (error) {

    console.error(
      "Generate document controller error:",
      error
    );

    return res.status(400).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// GET ALL DOCUMENTS
// ======================================

export const getAllDocuments =
async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const documents =
      await fetchAllDocuments({

        status:
          req.query.status,

        document_type_id:
          req.query.document_type_id,

        page
      });

    return res.status(200).json({

      success: true,

      page,

      count:
        documents.length,

      documents
    });

  } catch (error) {

    console.error(
      "Get all documents error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// GET DOCUMENT BY ID
// ======================================

export const getDocumentById =
async (req, res) => {

  try {

    const { id } = req.params;

    const document =
      await fetchDocumentById(id);

    if (!document) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    return res.status(200).json({

      success: true,

      document
    });

  } catch (error) {

    console.error(
      "Get document by ID error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// REGENERATE DOCUMENT
// ======================================

export const regenerateDocument =
async (req, res) => {

  try {

    const { id } = req.params;

    const {
      extra_instructions,
      special_requirements
    } = req.body;

    const existingDoc =
      await pool.query(

        `
        SELECT *
        FROM generated_documents
        WHERE id = $1
        LIMIT 1
        `,

        [id]
      );

    if (
      existingDoc.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    const original =
      existingDoc.rows[0];

    const updatedFormData = {

      ...original.form_data,

      extra_instructions:
        extra_instructions ||
        original.extra_instructions,

      special_requirements:
        special_requirements ||
        original.special_requirements
    };

    const regeneratedDoc =
      await documentGenerationService
        .generateLegalDocument(

          updatedFormData,

          req.user?.id || null
        );

    const versionUpdate =
      await pool.query(

        `
        UPDATE generated_documents
        SET version = $1
        WHERE id = $2
        RETURNING *
        `,

        [
          original.version + 1,
          regeneratedDoc.id
        ]
      );

    return res.status(200).json({

      success: true,

      message:
        "Document regenerated successfully",

      document:
        versionUpdate.rows[0]
    });

  } catch (error) {

    console.error(
      "Regenerate document error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// UPDATE DOCUMENT STATUS
// ======================================

export const updateDocumentStatus =
async (req, res) => {

  try {

    const { id } = req.params;

    const {
      status,
      admin_notes
    } = req.body;

    const validStatuses = [
      "draft",
      "reviewed",
      "approved",
      "archived"
    ];

    if (
      !validStatuses.includes(status)
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid status value"
      });
    }

    const result =
      await pool.query(

        `
        UPDATE generated_documents

        SET

          status = $1,

          admin_notes = $2,

          updated_at = NOW()

        WHERE id = $3

        RETURNING *
        `,

        [
          status,
          admin_notes || null,
          id
        ]
      );

    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    return res.status(200).json({

      success: true,

      message:
        "Document status updated",

      document:
        result.rows[0]
    });

  } catch (error) {

    console.error(
      "Update document status error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// DELETE DOCUMENT
// ======================================

export const deleteDocument =
async (req, res) => {

  try {

    const { id } = req.params;

    const result =
      await pool.query(

        `
        UPDATE generated_documents

        SET

          status = 'archived',

          updated_at = NOW()

        WHERE id = $1

        RETURNING *
        `,

        [id]
      );

    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    return res.status(200).json({

      success: true,

      message:
        "Document archived successfully"
    });

  } catch (error) {

    console.error(
      "Delete document error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// TEST GROQ CONNECTION
// ======================================

export const testGroq =
async (req, res) => {

  try {

    const result =
      await groqService
        .testGroqConnection();

    return res.status(200).json(
      result
    );

  } catch (error) {

    console.error(
      "Groq test error:",
      error
    );

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ======================================
// EXPORT DOCX
// ======================================

export const exportDocx =
async (req, res) => {

  try {

    const { id } =
      req.params;

    // ======================================
    // FETCH DOCUMENT
    // ======================================

    const document =
      await fetchDocumentById(id);

    if (!document) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    // ======================================
    // FETCH COMPANY SETTINGS
    // ======================================

    const settingsResult =
      await pool.query(

        `
        SELECT *
        FROM company_settings
        LIMIT 1
        `
      );

    const companySettings =
      settingsResult.rows[0] || {};

    // ======================================
    // GENERATE DOCX
    // ======================================

    const generatedFile =
      await docxExportService
        .generateDocx(

          document,

          companySettings
        );

    // ======================================
    // DOWNLOAD FILE
    // ======================================

    return res.download(

      generatedFile.filePath,

      generatedFile.fileName
    );

  } catch (error) {

    console.error(
      "Export DOCX error:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
};


// ======================================
// EXPORT PDF
// ======================================

export const exportPdf =
async (req, res) => {

  try {

    const { id } = req.params;

    const document =
      await fetchDocumentById(id);

    if (!document) {

      return res.status(404).json({

        success: false,

        error:
          "Document not found"
      });
    }

    return res.status(200).json({

      success: true,

      message:
        "PDF export endpoint ready"
    });

  } catch (error) {

    console.error(
      "Export PDF error:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
};


// ======================================
// PREVIEW DOCUMENT
// ======================================

export const previewDocument =
async (req, res) => {

  try {

    const { id } = req.params;

    const document =
      await fetchDocumentById(id);

    if (!document) {

      return res.status(404).send(
        "Document not found"
      );
    }

    return res.send(
      document.generated_draft ||
      "No preview available"
    );

  } catch (error) {

    console.error(
      "Preview document error:",
      error
    );

    return res.status(500).send(
      error.message
    );
  }
};
