const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Acadiverse Wiki pages.
const WikiPage = mongoose.model("account", new Schema({
    title: { //The title of the page.
        type: String,
        default: ""
    },
    author: { //The ID of the user who created the page.
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    content: { //The markdown code for the page content.
        type: String,
        default: ""
    },
    date_created: { //The date the article was created.
        type: Date,
        default: new Date()
    },
    last_edited: { //The date the article was last edited.
        type: Date,
        default: new Date()
    },
    is_locked: { //If true, only moderators and admins can edit the page.
        type: Boolean,
        default: false
    },
    history: { //A list of WikiEdit IDs showing edits made on the page.
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
}))

module.exports = WikiPage;