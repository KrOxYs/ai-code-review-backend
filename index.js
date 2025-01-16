const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const generate = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN); // Replace with your API key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following JavaScript code for issues related to security, performance, maintainability, and scalability. 
      For each category:
      1. Identify **all relevant issues** (if there are multiple issues, list each separately).
      2. Provide a **brief explanation** for each issue.
      3. Rewrite only the necessary parts of the code to address the identified issues, ensuring the rewritten code integrates the improvements directly without rewriting the entire code.
      4. If a category doesn't have a rewritten code solution based on the provided code, include a clear **example implementation** in the same language (JavaScript) demonstrating best practices for that category. These examples should be relevant to the identified issues but not necessarily tied directly to the original code.
      5. Format all solutions and example implementations in a code block (e.g., \`\`\`javascript \`\`\`), with clear labels indicating whether it's a rewritten solution or an example implementation.
      6. Return the output as a structured JSON object with the following keys:
         - "ratings": Ratings for each category on a scale of 1-10.
         - "issues": A list of identified issues in each category with explanations.
         - "rewritten_code": Rewritten parts of the code formatted as code blocks, categorized by security, performance, maintainability, and scalability. Include example implementations if applicable.

      Example JSON structure:
      {
        "ratings": {
          "security": 5,
          "performance": 6,
          "maintainability": 4,
          "scalability": 3
        },
        "issues": {
          "security": [
            { "issue": "Passwords stored in plaintext", "explanation": "Passwords are not hashed, making the system vulnerable to breaches." },
            { "issue": "SQL injection risk", "explanation": "Parameterized queries are not used, allowing attackers to inject malicious SQL code." }
          ],
          "performance": [
            { "issue": "No connection pooling", "explanation": "Each request creates a new connection, leading to performance bottlenecks under load." }
          ]
        },
        "rewritten_code": {
          "security": [
            { 
              "issue": "Passwords stored in plaintext", 
              "rewritten_code": "\`\`\`javascript
const bcrypt = require('bcrypt');

// Hash passwords when creating a new user
async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, hashedPassword]);
}
\`\`\`"
            },
            { 
              "issue": "SQL injection risk", 
              "rewritten_code": "\`\`\`javascript
connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
        return callback(err, null);
    }
    // Process results
});
\`\`\`"
            }
          ],
          "performance": [
            { 
              "issue": "No connection pooling", 
              "rewritten_code": "\`\`\`javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'yourdatabase',
    connectionLimit: 10 // Allow up to 10 concurrent connections
});

// Use the pool for database queries
pool.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    console.log(results);
});
\`\`\`"
            }
          ],
          "maintainability": [
            { 
              "issue": "Callback-based structure", 
              "rewritten_code": "\`\`\`javascript
async function login(username, password) {
    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await connection.promise().query(query, [username]);
        return rows;
    } catch (err) {
        console.error(err);
    }
}
\`\`\`"
            }
          ],
          "scalability": [
            { 
              "issue": "No caching mechanism", 
              "rewritten_code": "\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

// Caching query results
client.get('user:admin', async (err, data) => {
    if (data) {
        console.log(JSON.parse(data));
    } else {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await connection.promise().query(query, ['admin']);
        client.setex('user:admin', 3600, JSON.stringify(rows));
        console.log(rows);
    }
});
\`\`\`"
            }
          ]
        }
      }

      Analyze the following code snippet based on the instructions and provide your response in the specified format:
      
      const mysql = require('mysql2');

      // Create a connection to the database
      const connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'yourpassword',
          database: 'yourdatabase'
      });

      // Function to handle user login
      function login(username, password, callback) {
          // Check if the username and password match the database records
          const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
          connection.query(query, [username, password], (err, results) => {
              if (err) {
                  return callback(err, null);
              }

              if (results.length > 0) {
                  // User authenticated successfully, insert a login attempt
                  const insertQuery = 'INSERT INTO login_attempts (username, success) VALUES (?, ?)';
                  connection.query(insertQuery, [username, true], (insertErr) => {
                      if (insertErr) {
                          return callback(insertErr, null);
                      }
                      callback(null, 'Login successful!');
                  });
              } else {
                  // Login failed, insert a failed login attempt
                  const insertQuery = 'INSERT INTO login_attempts (username, success) VALUES (?, ?)';
                  connection.query(insertQuery, [username, false], (insertErr) => {
                      if (insertErr) {
                          return callback(insertErr, null);
                      }
                      callback(null, 'Invalid username or password.');
                  });
              }
          });
      }

      login('admin', 'password123', (err, message) => {
          if (err) {
              console.error('Error:', err);
          } else {
              console.log(message);
          }
      });

      connection.end();
    `;

    const result = await model.generateContent(prompt);

    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
};

generate();
