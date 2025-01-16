// Updated server.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

// Initialize express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1', // IPv4 localhost
    port: 3308,        // MySQL port
    user: 'root',      // Default MySQL username for XAMPP
    password: '',      // Default password for XAMPP (leave blank if none)
    database: 'employee_db' // Replace with your database name
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Add Employee (Create)
app.post('/employees', (req, res) => {
    const { name, position, salary } = req.body;

    if (!name || !position || typeof salary !== 'number' || salary <= 0) {
        return res.status(400).json({ error: 'Invalid input. Ensure all fields are correctly filled.' });
    }

    const query = 'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)';
    db.query(query, [name, position, salary], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add employee.' });
        }
        res.status(201).json({ message: 'Employee added successfully.', id: result.insertId });
    });
});

// View All Employees (Read)
app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve employees.' });
        }
        res.status(200).json(results);
    });
});

// View Single Employee (Read)
app.get('/employees/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM employees WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve employee.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update Employee (Update)
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, salary } = req.body;

    if (!name || !position || typeof salary !== 'number' || salary <= 0) {
        return res.status(400).json({ error: 'Invalid input. Ensure all fields are correctly filled.' });
    }

    const query = 'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?';
    db.query(query, [name, position, salary, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update employee.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee updated successfully.' });
    });
});

// Delete Employee (Delete)
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM employees WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete employee.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee deleted successfully.' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});