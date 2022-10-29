let express = require("express");
const router = express.Router()
let api  =  require("../controller/apiCollection")
router.post("/user",api.createUser)
router.post("/book",api.createBook)
router.post("/library",api.createLibrary)
router.get("/library/:id",api.allBook)
router.get("/getallbook",api.getBook)
router.get("/returnTime/:id",api.returnTime)


module.exports = router;