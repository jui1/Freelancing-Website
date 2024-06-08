const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.json());

const PORT = process.env.PORT;
const mongodbUrl = process.env.MONGODB_URL;

const authRoutes = require('./routes/authentication.js');

app.use('/api/auth', authRoutes);
const jwtSecret = process.env.JWT_SECRET;


const Project = require("./routes/project.js")
app.use('/api/projects', Project);

mongoose.connect(mongodbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


    
app.listen( PORT, () =>{
    console.log(`Server is runing on port ${PORT}`)
})