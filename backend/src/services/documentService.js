const pool = require("../config/db");

const createDocument = async ({
  title,
  content,
  document_type,
  user_id,
}) => {
  const query = `
    INSERT INTO generated_documents
    (title, content, document_type, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    title,
    content,
    document_type,
    user_id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getDocumentsByUser = async (user_id) => {
  const query = `
    SELECT *
    FROM generated_documents
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [user_id]);

  return result.rows;
};

const getDocumentById = async (id, user_id) => {
  const query = `
    SELECT *
    FROM generated_documents
    WHERE id = $1 AND user_id = $2;
  `;

  const result = await pool.query(query, [id, user_id]);

  return result.rows[0];
};

const deleteDocument = async (id, user_id) => {
  const query = `
    DELETE FROM generated_documents
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [id, user_id]);

  return result.rows[0];
};

module.exports = {
  createDocument,
  getDocumentsByUser,
  getDocumentById,
  deleteDocument,
};