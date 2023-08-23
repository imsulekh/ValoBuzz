const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    category: {
        type: String,
        enum: ['Patch Notes', 'Tips and Tricks', 'Tutorial', 'Bugs', 'Gameplay', 'Review'],
        required: 'This field is required.'
    },
    image: {
        type: String,
        required: 'This field is required.'
    }
});

blogSchema.index( { name: 'text', description: 'text' } );

// blogSchema.index( { "$**": "text" } );


module.exports = mongoose.model('Blog', blogSchema);