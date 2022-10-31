const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const librarySchema = new mongoose.Schema({
    bookId:{
        type: ObjectId,
        ref: 'Book',
    },
    userId:{
        type: ObjectId,
        ref: 'User',
    },
    issueDate: {
        type: Date, default: new Date()
    },
    returnDate: {
		type: Date,
		default: +new Date() + 7*24*60*60*1000,
	}
}, {
    timestamps: { createdAt: true, updatedAt: true },
})
module.exports = mongoose.model("Library", librarySchema);
