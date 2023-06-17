"use strict";
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'sandbox'
});
connection.connect();
//please use end to save memories
connection.execute('SELECT * FROM users', (error, results, fields) => {
    if (error)
        throw error;
    console.log(results[0]);
});
connection.end();
