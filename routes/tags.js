const express = require('express');
const ProjectTag = require('../models/ProjectTag');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tags = await ProjectTag.find();
        res.send(tags);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
