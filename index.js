const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const generate = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN); // Replace with your API key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // read file

    const directoryPath = "./test";

    // Use fs.readdir to read the contents of the directory asynchronously
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      console.log("Files and folders in the directory:", files);

      files.forEach(async (file) => {
        const filePath = path.join(directoryPath, file);

        fs.readFile(filePath, "utf8", async (err, data) => {
          if (err) {
            console.error("Error reading file:", err);
            return;
          }

          const prompt = `

          "Analyze the provided JavaScript code for issues in security, performance, maintainability, and scalability. For each category:
          (1) Identify issues with brief explanations.
          (2) Provide necessary rewritten code snippets to address issues directly.
          (3) If no direct fix applies, include a relevant example implementation demonstrating best practices.
      
          Return the result as structured JSON with keys: 'ratings' (scores for each category 1-10), 'issues' (list of identified issues with explanations for each category), and 'rewritten_code' (solutions categorized by each issue). Ensure rewritten code and examples are formatted as code blocks. Focus on brevity, clarity, and direct improvements without rewriting unnecessary parts. Example output:
      
          { "ratings": { "security": 6, "performance": 7, "maintainability": 5, "scalability": 4 }, "issues": { "security": [ { "issue": "SQL injection risk", "explanation": "Queries do not use parameterized inputs, exposing the application to SQL injection." } ], "performance": [ { "issue": "Lack of connection pooling", "explanation": "New connections are created for each request, which can degrade performance under high load." } ] }, "rewritten_code": { "security": [ { "issue": "SQL injection risk", "rewritten_code": "\`\`\`javascript\nconnection.query('SELECT * FROM users WHERE username = ?', [username], callback);\n\`\`\`" } ], "performance": [ { "issue": "Lack of connection pooling", "rewritten_code": "\`\`\`javascript\nconst pool = mysql.createPool({ connectionLimit: 10, ...config });\npool.query('SELECT * FROM users', callback);\n\`\`\`" } ] } }"
      
          Analyze this code
          ${data}
          `;

          const result = await model.generateContent(prompt);

          console.log(result.response.text());

          // console.log(data);
        });
      });
    });

    // const prompt = `

    // "Analyze the provided JavaScript code for issues in security, performance, maintainability, and scalability. For each category:
    // (1) Identify issues with brief explanations.
    // (2) Provide necessary rewritten code snippets to address issues directly.
    // (3) If no direct fix applies, include a relevant example implementation demonstrating best practices.

    // Return the result as structured JSON with keys: 'ratings' (scores for each category 1-10), 'issues' (list of identified issues with explanations for each category), and 'rewritten_code' (solutions categorized by each issue). Ensure rewritten code and examples are formatted as code blocks. Focus on brevity, clarity, and direct improvements without rewriting unnecessary parts. Example output:

    // { "ratings": { "security": 6, "performance": 7, "maintainability": 5, "scalability": 4 }, "issues": { "security": [ { "issue": "SQL injection risk", "explanation": "Queries do not use parameterized inputs, exposing the application to SQL injection." } ], "performance": [ { "issue": "Lack of connection pooling", "explanation": "New connections are created for each request, which can degrade performance under high load." } ] }, "rewritten_code": { "security": [ { "issue": "SQL injection risk", "rewritten_code": "\`\`\`javascript\nconnection.query('SELECT * FROM users WHERE username = ?', [username], callback);\n\`\`\`" } ], "performance": [ { "issue": "Lack of connection pooling", "rewritten_code": "\`\`\`javascript\nconst pool = mysql.createPool({ connectionLimit: 10, ...config });\npool.query('SELECT * FROM users', callback);\n\`\`\`" } ] } }"

    // Analyze this code

    // `;

    // const result = await model.generateContent(prompt);

    // console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
};

generate();

// const directoryPath = "./test";

// // Use fs.readdir to read the contents of the directory asynchronously
// fs.readdir(directoryPath, (err, files) => {
//   if (err) {
//     console.error("Error reading directory:", err);
//     return;
//   }

//   console.log("Files and folders in the directory:", files);

//   // Use fs.readdir to read the contents of each file asynchronously
//   files.forEach(async (file) => {
//     const filePath = path.join(directoryPath, file);
//     fs.readFile(filePath, "utf8", async (err, data) => {
//       if (err) {
//         console.error("Error reading file:", err);
//         return;
//       }

//       console.log("File content:", data);

//       // const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN); // Replace with your API key
//       // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       // const result = await model.generateContent(data);

//       // console.log(result.response.text());
//     });
//   });
// });
