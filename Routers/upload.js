const ex= require("express")
const cloudinary= require('../cloudinary')
const router= ex.Router();
const multer= require('../middleware/multer')

router.post("/posing", multer.single("image"), async(req, res)=>{

    try {
        const re= await cloudinary.uploader.upload(req.file.path)
        res.json(re)
    } catch (error) {
        res.send(error)
    }
})

module.exports= router;