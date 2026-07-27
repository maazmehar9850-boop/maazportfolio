const express = require('express');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tech, liveUrl, githubUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const project = await Project.create({
      title,
      description,
      tech: tech || '',
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { title, description, tech, liveUrl, githubUrl } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (tech !== undefined) project.tech = tech;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;

    if (req.file) {
      if (project.image) {
        const old = path.join(__dirname, '..', project.image);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      project.image = `/uploads/${req.file.filename}`;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.image) {
      const filePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
