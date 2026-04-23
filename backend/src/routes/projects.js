const express = require('express');
const { v4: uuidv4 } = require('uuid');
const clientPromise = require('../lib/db');
const router = express.Router();

router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const projectsCollection = db.collection("projects");
        const projects = await projectsCollection.find({ userId }).toArray();
        res.status(200).json(projects);
    } catch (error) {
        console.error("Fetch projects error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { userId, project } = req.body;

    if (!userId || !project) {
        return res.status(400).json({ message: 'User ID and project data are required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const projectsCollection = db.collection("projects");

        const newProject = {
            ...project,
            _id: project.id || uuidv4(),
            userId,
            updatedAt: new Date(),
        };

        await projectsCollection.updateOne(
            { _id: newProject._id },
            { $set: newProject },
            { upsert: true }
        );

        res.status(200).json(newProject);
    } catch (error) {
        console.error("Save project error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const projectsCollection = db.collection("projects");
        const project = await projectsCollection.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error("Fetch project error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await clientPromise;
        const db = client.db("Archynex");
        const projectsCollection = db.collection("projects");
        await projectsCollection.deleteOne({ _id: id });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Delete project error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
