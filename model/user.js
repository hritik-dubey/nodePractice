const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
    },
    bookId: [{
            type: ObjectId,
            ref: 'Book',
        }],
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
}, {
    timestamps: { createdAt: true, updatedAt: true },
});


module.exports = mongoose.model("User", userSchema);