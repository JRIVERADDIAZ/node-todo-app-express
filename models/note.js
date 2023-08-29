const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    title: String,
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

const Note = mongoose.model("Note", notesSchema)

module.exports = Note