const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const librarySchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'Book',

    },

    userId:
    {
        type: ObjectId,
        ref: 'User',
    },
}, {
    timestamps: { createdAt: true, updatedAt: true },
})
module.exports = mongoose.model("Library", librarySchema);
