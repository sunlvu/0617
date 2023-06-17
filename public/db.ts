const mysql = require("mysql2")
const connection = mysql.createConnection({
    host: '127.0.0.1', //'localhost',
    user: 'root',
    password: 'root',
    database: 'sandbox'
  });
   
  connection.connect();

  //please use end to save memories
  connection.execute('SELECT * FROM users',  (error: any, results: any[], fields: any) => {
    if (error) throw error;
    console.log(results[0]);
  });
   
  connection.end();