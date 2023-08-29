const Note = require('../models/note')

const fetchSpecificNotes = async (req, res) => {
    // Get id off the url   
    const noteId = req.params.id;
    // Find the note using that id
    const note = await Note.findOne({
        _id: noteId,
        user: req.user._id
    });
    //  Respond ith the note 
    res.json({ note })
}

const fetchAllNotes = async (req, res) => {
    // Find notes
    const notes = await Note.find({ user: req.user._id });
    // Response with the notes
    res.json({ notes: notes });
}

const createNote = async (req, res) => {
    //Get the sent data in data off request body.
    const { title, body } = req.body

    // Create a note with it.
    const note = await Note.create({
        title,
        body,
        user: req.user._id
    })

    //Respond with the note.
    res.json({ note })
}

const editNote = async (req, res) => { 
    // Get the id of the url 
    const noteId = req.params.id;
    // Fet the data off the req body 
    const title = req.body.title;
    const body = req.body.body;
    // // Find and update the record
    await Note.findOneAndUpdate({
        _id: noteId,
        user: req.user._id
    }, {
        title: title,
        body: body
    });
    // // Find updated note
    const note = await Note.findById(noteId)
    // // Responde with it 
    res.json({ note: note })
}

const deleteNote = async (req, res) => {
    // Get the id of the url 
    const noteId = req.params.id;

    // // Delete Recor
    await Note.deleteOne({ 
        _id: noteId, 
        user: req.user._id })

    // // Response 
    res.json({ succes: "Record Deleted" });
}

module.exports = {
    fetchSpecificNotes: fetchSpecificNotes,
    fetchAllNotes: fetchAllNotes,
    createNote: createNote,
    editNote: editNote,
    deleteNote: deleteNote
}