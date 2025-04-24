const { sql, poolPromise } = require("../config/db");

exports.findUserByuserName = async (userName) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('userName', sql.VarChar, userName)
      .query('SELECT * FROM Users WHERE userName = @userName');

    return result.recordset[0]; // first match
  } catch (err) {
    console.error('FindUser Error:', err);
    throw err;
  }
};

exports.addUser = async (userName, hashedPassword, email, isActive, isLocked, role) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('userName', sql.VarChar, userName)
      .input('passwordHash', sql.VarChar, hashedPassword)
      .input('email', sql.VarChar, email)
      .input('isActive', sql.Bit, isActive)
      .input('isLocked', sql.Bit, isLocked)
      .input('role', sql.VarChar, role)
      .query(`
        INSERT INTO Users (userName, PasswordHash, Email, IsActive, IsLocked, Role)
        VALUES (@userName, @passwordHash, @email, @isActive, @isLocked, @role)
      `);

    return result;
  } catch (err) {
    console.error('AddUser Error:', err);
    throw err;
  }
};
