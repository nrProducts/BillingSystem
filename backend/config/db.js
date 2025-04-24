const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=NITHIN;Database=BillingProduct;Trusted_Connection=Yes;',
  driver: 'msnodesqlv8'
};

const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('✅ Connected to SQL Server via msnodesqlv8');
    return pool;
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
