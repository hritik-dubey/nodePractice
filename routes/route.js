let express = require("express");
const router = express.Router()
let api  =  require("../controller/apiCollection")
let auth  =  require("../middelware/auth")
router.post("/signUp",api.createUser)
router.post("/login",api.loginUser)
router.post("/book",api.createBook)
// router.post("/library",api.createLibrary)
router.get("/allbook",auth.Authentication,api.allBook)
router.post("/searchBook",api.searchBook) 
// router.get("/returnTime",auth.Authentication,api.returnTime)
router.post("/selectBook",auth.Authentication,api.selectYourBook)
router.post("/extendDate",auth.Authentication,api.extendDays)
router.post("/returnBook",auth.Authentication,api.returnBook)
router.post("/addBooksInLibrary",api.addBooksInLibrary)


module.exports = router;