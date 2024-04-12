const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Acadiverse Wiki edits.
const WikiEdit = mongoose.model("account", new Schema({
    page_id: { //The ID of the page the edit is associated with.
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    contributor: { //The ID of the user associated with the edit.
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    old_source: { //The old source of the page.
        type: String,
        default: ""
    },
    new_source: { //The new source of the page.
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now()
    }
}))

module.exports = WikiEdit;