const mysql = require("mysql");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "users_db",
  });

  connection.connect();

  // SQL injection vulnerability
  const query = `SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
    } else if (results.length > 0) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });

  // No connection pooling
  connection.end();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
