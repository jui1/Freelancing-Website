const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
     },
    description: {
         type: String,
          required: true
         },
    client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true },
    tags: [ {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'ProjectTag' 
        }],
    createdAt: {
         type: Date, 
        default: Date.now
     }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
