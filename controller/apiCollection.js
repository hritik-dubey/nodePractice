const mongoose = require("mongoose");
let user = require("../model/user")
let book = require("../model/book")
let library = require("../model/library")

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
let createLibrary = async (req, res) => {
    try {
        // if(req.body.bookId){
        // let  addBookInLibrary = await book.findOneAndUpdate({ '$push': { 'bookId.$': req.body.bookId }})
        // return res.status(200).send({ status: true, message: "book created succesfully", data:addBookInLibrary });

        // }
        // if(req.body.userId){
        //     let  addBookInLibrary = await book.findOneAndUpdate({ '$push': { 'bookId.$': req.body.page }})
        //     return res.status(201).send({ status: true, message: "book created succesfully", data:addBookInLibrary });

        // }
        let libraryCreate = await library.create(req.body)
        return res.status(201).send({ status: true, message: "library created succesfully", data: libraryCreate });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
let allBook = async (req, res) => {
    try {
        let getUser = await library.findOne({ userId: req.params.id })
        if (getUser) {
            let getBook = await book.find();
            return res.status(201).send({ status: true, message: "book geted succesfully", data: getBook });
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
let getBook = async (req, res) => {
    try {
        if (req.body.title) {
            let getBook = await book.find({ title: req.body.title })
            return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
        } if (req.body.author) {
            let getBook = await book.find({ author: req.body.author })
            return res.status(200).send({ status: true, message: "book geted succesfully", data: getBook });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}
let returnTime = async (req, res) => {
    try {
        let getUser = await user.findOne({ _id: req.params.id })
        let getDate = getUser.joined.getDate()
        let currentDate = new Date().getDate()
        if (currentDate > getDate + 7) {
            return res.status(200).send({ status: true, message: "submit your book ", });
        }
        return res.status(200).send({ status: true, message: `submit your book  in ${(getDate + 7 - currentDate)} days` });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message });
    }
}

module.exports = { createUser, createBook, createLibrary, allBook, getBook, returnTime }