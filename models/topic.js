// models/DsaTopic.js
const mongoose = require('mongoose');

const topicSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },
        subtopics: [
            {
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                youtubeLink: {
                    type: String
                },
                leetcodeLink: {
                    type: String
                },
                articleLink: {
                    type: String
                },
            },
        ],
    }
);

module.exports = mongoose.model('topics', topicSchema);
