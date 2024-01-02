const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON in the request body

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "generationAlpha",
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, password];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json({ success: true, data });
  });
});

const verifyJwt = (req, res, next) => {

  const token = req.headers["access-token"];

  if (!token) {
    return res.json("We need token please provide it for next time");
  } else {
    jwt.verify(token, "jwtSecretKey", (err, decoded) => {
      if (err) {
        return res.json("Not Authenticated");
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/checkAuth", verifyJwt, (req, res) => {
  return res.json("Authenticated");
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";

  console.log("Request Body:", req.body);

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json("Error");
    }

    console.log("Database Query Result:", data);

    if (data.length > 0) {
      const id = data[0].id;
      const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 300 });
      return res.status(200).json({ Login: true, token, data });
    } else {
      return res.status(401).json("Failed");
    }
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081 🔥");
});
