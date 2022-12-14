const mongoose = require("mongoose");
let user = require("../model/user")
let book = require("../model/book")
let library = require("../model/library")
const jwt = require("jsonwebtoken");



let createUser = async (req, res) => {
    try {
        if (req.body.email) {
            let validUser = await user.findOne({ email: req.body.email })
            if (validUser) {
                return res.status(500).send({ status: false, message: "email has been use" });
            }
        }
        let userCreate = await user.create(req.body)
        return res.status(201).send({ status: true, message: "user created succesfully", data: userCreate });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
let createBook = async (req, res) => {
    try {
        if (!req.body.ISBN) {
            return res.status(400).send({ status: false, message: "ISBN IS REQUIRED" });
        }
        let getRequired = await book.findOne({ ISBN: req.body.ISBN })
        if (getRequired) {
            return res.status(400).send({ status: false, message: "ISBN IS NOTVALID" });
        }
        let bookCreate = await book.create(req.body)
        return res.status(201).send({ status: true, message: "book created succesfully", data: bookCreate });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
// let createLibrary = async (req, res) => {
//     try {
//         let libraryCreate = await library.create(req.body)
//         return res.status(201).send({ status: true, message: "library created succesfully", data: libraryCreate });
//     } catch (err) {
//         return res.status(500).send({ status: false, message: "Error", error: err.message });
//     }
// }
const loginUser = async function (req, res) {
    try {

        let { email, password } = req.body;
        let getUser = await user.findOne({ email });
        if (!getUser) return res.status(404).send({ status: false, msg: "User not found!" });
        let token = jwt.sign(
            {
                userId: getUser._id,
                expiresIn: "30d",
            }, "jwt")
        return res.status(200).send({ status: true, message: "User login sucessful", data: { userId: getUser._id, token: token }, });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
};
let allBook = async (req, res) => {
    try {
        let books = await book.find()
        return res.status(201).send({ status: true, message: "all books", data: books });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
let searchBook = async (req, res) => {
    try {
        if (req.body.author && req.body.title) {
            let getBook = await book.find({ $and: [{ author: { $regex: req.body.author, $options: "i" } }, { title: { $regex: req.body.title, $options: "i" } }] })
            return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
        }
        if (req.body.author) {
            let getBook = await book.find({ author: { $regex: req.body.author, $options: "i" } })
            return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
        }
        if (req.body.title) {
            let getBook = await book.find({ title: { $regex: req.body.title, $options: "i" } })
            return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
        }
        // return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
// let returnTime = async (req, res) => {
//     try {
//         // let getUser = await user.findOne({ _id: req.params.id })
//         const getUser = req.decodeToken.userId;
//         let getDate = getUser.return
//         let currentDate = new Date()
//         if (currentDate > getDate) {
//             return res.status(200).send({ status: true, message: "submit your book ", });
//         }
//         return res.status(200).send({ status: true, message: `submit your book  in ${~~((getDate - currentDate) / (1000 * 3600 * 24))} days` });
//     } catch (err) {
//         return res.status(500).send({ status: false, message: "Error", error: err.message });
//     }
// }
let selectYourBook = async (req, res) => {
    try {
        const getuserId = req.decodeToken.userId;
        let quantity = req.body.stock;
        let getBook = await book.findOne({ _id: req.body.bookId })
        if (getBook.stock >= quantity) {
            if (getBook.stock) {
                for (let i = 0; i < quantity; i++) {
                    let userUpdate = await user.findByIdAndUpdate({ _id: getuserId }, { '$push': { 'bookId': req.body.bookId } })
                    let updateLibrary = await library.create({ bookId: req.body.bookId, userId: getuserId })
                }
                let getUpdateBook = await book.findByIdAndUpdate({ _id: req.body.bookId }, { stock: (getBook.stock - quantity) }, {new:true})
                return res.status(200).send({ status: true, message: "collect your book", data: getUpdateBook });
            }
        } else {
            return res.status(200).send({ status: true, message: "book is not availabel" });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}
let extendDays = async (req, res) => {
    try {
        const getuserId = req.decodeToken.userId;
        let adddays = req.body.day;
        let getUser = await library.findOne({ userId: getuserId,_id:req.body.libraryId})
        let returnDate = getUser.returnDate
        returnDate.setDate(returnDate.getDate() + adddays)
        let extendDate = await library.findOneAndUpdate({ userId: getuserId,_id:req.body.libraryId }, { returnDate: returnDate }, { new: true })
        return res.status(200).send({ status: true, message: "your date is extended ", data: extendDate });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}
let returnBook = async (req, res) => {
    try {
        let count = 0
        const getuserId = req.decodeToken.userId;
        let quantity = req.body.stock;
        if (!quantity) {
            quantity = 1
        }
        let getUser = await user.findById(getuserId)
        let getBook = await book.findById(req.body.bookId)
        for (let i = 0; i < getUser.bookId.length; i++) {
            if ((getUser.bookId[i] == req.body.bookId) && quantity) {
                let getLibrary = await library.findOneAndDelete({ userId: getuserId, bookId: req.body.bookId })
                let result = await user.findOne({ _id: getuserId })
                const index = result.bookId.findIndex(element => element === req.body.bookId );
                result.bookId.splice(index, 1);
                await result.save()
                count++
                quantity--
            }
        }
        let updateBook = await book.findOneAndUpdate({ _id: req.body.bookId }, { stock: getBook.stock + count },{new:true})
        return res.status(200).send({ status: true, message: "your book is returned ", data: updateBook });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}
// let addBooksInLibrary = async (req, res) => {
//     try {
//         let getBook = await book.findById(req.body.bookId);
//         if (getBook) {
//             let addInLibrary = await library.create(req.body);
//             return res.status(200).send({ status: true, message: "book added in library", data: addInLibrary });
//         } else {
//             return res.status(200).send({ status: true, message: "enter valid bookId" });
//         }
//     } catch (err) {
//         return res.status(500).send({ status: false, message: "Error", error: err.message })
//     }
// }
module.exports = { createUser, createBook, allBook, searchBook, loginUser, selectYourBook, extendDays, returnBook}