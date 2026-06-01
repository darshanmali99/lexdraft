import pool from "../config/db.js";

import processTemplate
from "../services/fileProcessor.js";


// ==============================
// DOCUMENT TYPES
// ==============================

// CREATE DOCUMENT TYPE
export const createDocumentType =
async (req, res) => {

  try {

    const {
      name,
      description
    } = req.body;

    const result =
      await pool.query(

        `INSERT INTO document_types
        (
          name,
          description
        )
        VALUES ($1, $2)
        RETURNING *`,

        [name, description]
      );

    res.status(201).json({

      success: true,

      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// GET ALL DOCUMENT TYPES
export const getDocumentTypes =
async (req, res) => {

  try {

    const result =
      await pool.query(

        `SELECT *
         FROM document_types
         ORDER BY created_at DESC`
      );

    res.json({

      success: true,

      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// DELETE DOCUMENT TYPE
export const deleteDocumentType =
async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(

      `DELETE FROM document_types
       WHERE id = $1`,

      [id]
    );

    res.json({

      success: true,

      message:
        "Document type deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ==============================
// CLAUSES
// ==============================

// CREATE CLAUSE
export const createClause =
async (req, res) => {

  try {

    const {
      document_type_id,
      title,
      content,
      tags,
      is_mandatory
    } = req.body;

    const result =
      await pool.query(

        `INSERT INTO clauses
        (
          document_type_id,
          title,
          content,
          tags,
          is_mandatory
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,

        [
          document_type_id,
          title,
          content,
          tags,
          is_mandatory
        ]
      );

    res.status(201).json({

      success: true,

      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// GET ALL CLAUSES
export const getClauses =
async (req, res) => {

  try {

    const {
      document_type_id
    } = req.query;

    let query =
      "SELECT * FROM clauses";

    let values = [];

    if (document_type_id) {

      query +=
        " WHERE document_type_id = $1";

      values.push(
        document_type_id
      );
    }

    query +=
      " ORDER BY created_at DESC";

    const result =
      await pool.query(
        query,
        values
      );

    res.json({

      success: true,

      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ==============================
// TEMPLATE UPLOAD
// ==============================

// UPLOAD TEMPLATE
export const uploadTemplate =
async (req, res) => {

  try {

    const {
      document_type_id,
    } = req.body;

    const file =
      req.file;

    // ======================================
    // VALIDATION
    // ======================================

    if (!file) {

      return res.status(400).json({

        success: false,

        message:
          "No file uploaded"
      });
    }

    // ======================================
    // DETECT FILE TYPE
    // ======================================

    const fileType =
      file.mimetype.includes("pdf")
        ? "pdf"
        : "docx";

    // ======================================
    // SAVE TEMPLATE RECORD
    // ======================================

    const result =
      await pool.query(

        `INSERT INTO templates
        (
          document_type_id,
          name,
          file_path,
          file_type
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,

        [
          document_type_id || null,

          file.originalname,

          file.path,

          fileType
        ]
      );

    const template =
      result.rows[0];

    // ======================================
    // PROCESS TEMPLATE
    // ======================================

    await processTemplate(
      template
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({

      success: true,

      message:
        "Template uploaded successfully",

      data: template
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// GET ALL TEMPLATES
export const getTemplates =
async (req, res) => {

  try {

    const result =
      await pool.query(

        `SELECT *
         FROM templates
         ORDER BY created_at DESC`
      );

    res.json({

      success: true,

      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// ==============================
// COMPANY SETTINGS
// ==============================

// CREATE / UPDATE SETTINGS
export const saveCompanySettings =
async (req, res) => {

  try {

    const {
      company_name,
      company_address,
      company_phone,
      company_email,
      letterhead_instructions,
      default_jurisdiction
    } = req.body;

    const existing =
      await pool.query(
        `SELECT *
         FROM company_settings
         LIMIT 1`
      );

    let result;

    // UPDATE EXISTING
    if (
      existing.rows.length > 0
    ) {

      result =
        await pool.query(

          `UPDATE company_settings
           SET
             company_name = $1,
             company_address = $2,
             company_phone = $3,
             company_email = $4,
             letterhead_instructions = $5,
             default_jurisdiction = $6,
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,

          [
            company_name,
            company_address,
            company_phone,
            company_email,
            letterhead_instructions,
            default_jurisdiction,
            existing.rows[0].id
          ]
        );

    } else {

      // CREATE NEW

      result =
        await pool.query(

          `INSERT INTO company_settings
          (
            company_name,
            company_address,
            company_phone,
            company_email,
            letterhead_instructions,
            default_jurisdiction
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,

          [
            company_name,
            company_address,
            company_phone,
            company_email,
            letterhead_instructions,
            default_jurisdiction
          ]
        );
    }

    res.json({

      success: true,

      data: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};


// GET COMPANY SETTINGS
export const getCompanySettings =
async (req, res) => {

  try {

    const result =
      await pool.query(

        `SELECT *
         FROM company_settings
         LIMIT 1`
      );

    res.json({

      success: true,

      data:
        result.rows[0] || null
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};

// ======================================
// UPLOAD COMPANY LOGO
// ======================================

export const uploadCompanyLogo =
async (req, res) => {

  try {

    // VALIDATE FILE

    if (!req.file) {

      return res.status(400).json({

        success: false,

        error:
          "No file uploaded"
      });
    }

    // CREATE FILE URL

    const logo_url =
      `/uploads/${req.file.filename}`;

    // CHECK EXISTING SETTINGS

    const existing =
      await pool.query(

        `
        SELECT *
        FROM company_settings
        LIMIT 1
        `
      );

    let result;

    // UPDATE EXISTING SETTINGS

    if (
      existing.rows.length > 0
    ) {

      result =
        await pool.query(

          `
          UPDATE company_settings

          SET

            logo_url = $1,

            updated_at = NOW()

          WHERE id = $2

          RETURNING *
          `,

          [
            logo_url,
            existing.rows[0].id
          ]
        );

    } else {

      // CREATE NEW SETTINGS

      result =
        await pool.query(

          `
          INSERT INTO company_settings
          (
            logo_url
          )

          VALUES ($1)

          RETURNING *
          `,

          [logo_url]
        );
    }

    // SUCCESS RESPONSE

    return res.status(200).json({

      success: true,

      logo_url,

      data: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Upload company logo error:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
};