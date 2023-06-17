const mysql = require("mysql2");
const http = require('http');
const url = require('url');
const qs = require('querystring');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'sandbox'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (req.method === 'POST' && pathname === '/register') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const { username, password } = qs.parse(body);

            // save user's information
            saveUser(username, password)
                .then(() => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'User saved successfully' }));
                })
                .catch((error) => {
                    console.error('Error saving user:', error);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Internal Server Error' }));
                });
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

function saveUser(username, password) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const values = [username, password];

        connection.execute(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}