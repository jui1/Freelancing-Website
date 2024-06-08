const express = require('express');
const Project = require('../models/Project.js');
const { auth, role } = require('../controllers/authentication.js');

const router = express.Router();


router.post('/', auth, role(['Client']), async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const project = await Project.create({ title, description, client: req.user._id, tags });
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/', auth, role(['Client']), async (req, res) => {
    try {
        const projects = await Project.find({ client: req.user._id }).populate('client', 'username').populate('tags', 'name');
        res.send(projects);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.put('/:id', auth, role(['Client']), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: id, client: req.user._id },
            { title, description, tags },
            { new: true }
        );

        if (!project) {
            return res.status(404).send('Project not found or access denied.');
        }

        res.send(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete('/:id', auth, role(['Client']), async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project || project.client.toString() !== req.user._id.toString()) {
            return res.status(404).send('Project not found or access denied.');
        }
        await project.remove();
        res.send('Project removed.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
