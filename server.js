const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://fayrent.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

// Function to get database connection
async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error creating database connection:', error);
        throw error;
    }
}

// Store status endpoints
app.get('/api/store-status', async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query('SELECT * FROM store_status LIMIT 1');
        await connection.end();

        res.json(results[0] || { isOpen: true, openTime: '09:00', closeTime: '21:00' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/store-status', async (req, res) => {
    try {
        const { isOpen, openTime, closeTime } = req.body;
        const connection = await getConnection();

        await connection.query(
            'UPDATE store_status SET isOpen = ?, openTime = ?, closeTime = ? WHERE id = 1',
            [isOpen, openTime, closeTime]
        );

        await connection.end();
        res.json({ message: 'Store status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Consoles endpoints
app.get('/api/consoles', async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query('SELECT * FROM consoles');
        await connection.end();

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/consoles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tersedia } = req.body;
        const connection = await getConnection();

        await connection.query(
            'UPDATE consoles SET tersedia = ? WHERE id = ?',
            [tersedia, id]
        );

        await connection.end();
        res.json({ message: 'Console status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});