const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
require('dotenv').config();
const { verifyToken, authorizeRoles } = require('./auth');

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Import routes
const userRoutes = require('./user');
app.use('/api', userRoutes);


// Functions APIs

// Admin: Fetch all projects
app.get("/api/projects", verifyToken, authorizeRoles('Admin'), (req, res) => {
  db.query("SELECT * FROM project", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Admin + Supervisor: Fetch all supervisors
app.get("/api/supervisors", verifyToken, authorizeRoles('Admin', 'Supervisor'), (req, res) => {
  db.query("SELECT * FROM Supervisor", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Admin + Contractor + Supervisor: Fetch contractors (Contractor sees only their own)
app.get("/api/contractors", verifyToken, authorizeRoles('Admin', 'Contractor','Supervisor'), (req, res) => {
  const userId = req.user.UserId;
  if (req.user.Role === 'Contractor') {
    db.query("SELECT * FROM Contractor WHERE userId = ?", [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    db.query("SELECT * FROM Contractor", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }
});

// Admin + Supervisor: Fetch worklogs
app.get("/api/worklogs", verifyToken, authorizeRoles('Admin', 'Supervisor'), (req, res) => {
  db.query("SELECT * FROM worklog", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Admin + Supervisor: Add new worklog
app.post("/api/worklogs", verifyToken, authorizeRoles('Supervisor','Admin'), (req, res) => {
  const { Date, WorkforceAssigned } = req.body;
  db.query(
    "INSERT INTO worklog (Date, WorkforceAssigned) VALUES (?, ?)",
    [Date, WorkforceAssigned],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Worklog added", id: result.insertId });
    }
  );
});


// USER APIs

// Admin + Supervisor(only for contractors): Create a new user (no password hashing)
app.post("/api/users", verifyToken, authorizeRoles('Admin', 'Supervisor'), (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  if (req.user.role === "Supervisor" && role !== "Contractor") {
    return res.status(403).json({ message: "Supervisors can only create Contractor users" });
  }

  db.query(
    "INSERT INTO users (Username, PasswordHash, Role) VALUES (?, ?, ?)",
    [username, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User created", id: result.insertId });
    }
  );
});

// Supervisor: Create a new contractor (linked to existing userId)
app.post("/api/contractors", verifyToken, authorizeRoles('Supervisor'), (req, res) => {
  const {  Id,name, specialization} = req.body;

  if (!Id || !name || !specialization) {
    return res.status(400).json({ message: " Id,name and specialization are required" });
  }

  db.query(
    "INSERT INTO contractor (ContractorID  , Name ,  Specialization) VALUES (?, ?, ?)",
    [ Id,name, specialization],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Contractor created", id: result.Id });
    }
  );
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

