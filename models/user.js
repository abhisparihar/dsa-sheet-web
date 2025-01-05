const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            private: true,
        },
        completedTopics: {
            type: Array,
            default: []
        }
    }, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);