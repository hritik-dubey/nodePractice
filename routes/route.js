let express = require("express");
const router = express.Router()
let api  =  require("../controller/apiCollection")
let auth  =  require("../middelware/auth")
router.post("/signUp",api.createUser)
router.post("/login",api.loginUser)
router.post("/book",api.createBook)
router.post("/library",api.createLibrary)
router.get("/library/:id",api.allBook)
router.get("/getallbook",api.getBook)
router.get("/returnTime/:id",api.returnTime)
router.get("/selectBook",auth.Authentication,api.selectYourBook)
router.get("/extendDate/",auth.Authentication,api.extendDays)
router.post("/returnBook",auth.Authentication,api.returnBook)


module.exports = router;