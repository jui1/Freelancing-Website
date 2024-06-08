const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User.js');

const router = express.Router();

router.post('/client/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (role !== 'Client') {
        return res.status(400).send('Invalid role.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('Client registered.');
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.post('/freelancer/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (role !== 'Freelancer') {
        return res.status(400).send('Invalid role.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('Freelancer registered.');
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid email or password.');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
