const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // One Day
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "generationAlpha",
});

app.get("/", (req, res) => {
  if (req.session.name) {
    return res.json({ valid: true, name: req.session.name });
  } else {
    return res.json({ valid: false });
  }
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
    return res.json("We need a token, please provide it for the next time");
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

app.post("/login", async (req, res) => {
  try {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const data = await dbQuery(sql, [req.body.email, req.body.password]);

    if (data.length > 0) {
      const id = data[0].id;
      const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 300 });
      req.session.name = data[0].name;
      return res.status(200).json({ Login: true, name: req.session.name, token });
    } else {
      return res.status(401).json("Failed");
    }
  } catch (error) {
    console.error("Error in login request:", error);
    return res.status(500).json("Error");
  }
});

const dbQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

app.listen(8081, () => {
  console.log("Listening on port 8081 🔥");
});
