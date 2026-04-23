const express = require('express');
const { v4: uuidv4 } = require('uuid');
const clientPromise = require('../lib/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const newUser = {
            _id: uuidv4(),
            username,
            password,
            createdAt: new Date(),
        };

        await usersCollection.insertOne(newUser);

        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
