import pool from "./src/config/db.js";
(async () => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users';
    `);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
})();
