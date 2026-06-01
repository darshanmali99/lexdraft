import pg from "pg";
const { Pool } = pg;
async function test(pw) {
  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "lexdraft",
    password: pw,
    port: 5432,
  });
  try {
    await pool.query('SELECT NOW()');
    console.log(`Success with password: ${pw}`);
    const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`);
    console.log('Columns:', res.rows.map(r => r.column_name).join(', '));
  } catch (err) {
    // console.log(`Failed with password: ${pw}`);
  } finally {
    pool.end();
  }
}

(async () => {
  await test("password");
  await test("postgres");
  await test("root");
  await test("123456");
  await test("");
})();
