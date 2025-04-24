const { sql, poolPromise } =  require("../config/db");

exports.findUserByUsername = async (username) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    return result.recordset[0]; // first match
  } catch (err) {
    console.error('FindUser Error:', err);
    throw err;
  }
};

exports.addUser = async (username, hashedPassword) => {
  await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
};


