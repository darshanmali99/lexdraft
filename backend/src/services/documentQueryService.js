import pool from "../config/db.js";

// ======================================
// GET ALL DOCUMENTS
// ======================================

export const fetchAllDocuments =
async ({
  status,
  document_type_id,
  page = 1,
  limit = 20
}) => {

  const offset =
    (page - 1) * limit;

  let query = `
    SELECT
      id,
      title,
      client_name,
      document_type_name,
      status,
      version,
      created_at
    FROM generated_documents
    WHERE status != 'archived'
  `;

  const values = [];

  let paramCount = 1;

  if (status) {

    query += `
      AND status = $${paramCount}
    `;

    values.push(status);

    paramCount++;
  }

  if (document_type_id) {

    query += `
      AND document_type_id = $${paramCount}
    `;

    values.push(
      document_type_id
    );

    paramCount++;
  }

  query += `
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const result =
    await pool.query(
      query,
      values
    );

  return result.rows;
};

// ======================================
// GET DOCUMENT BY ID
// ======================================

export const fetchDocumentById =
async (id) => {

  const result =
    await pool.query(

      `
      SELECT *
      FROM generated_documents
      WHERE id = $1
      LIMIT 1
      `,

      [id]
    );

  return result.rows[0];
};