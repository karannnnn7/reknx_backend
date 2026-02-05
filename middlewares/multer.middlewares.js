import multer from "multer";
import os from 'os'


const storage = multer.diskStorage({
  destination: function (req, file, cb) { // cb = callback
    // cb(null, '../project/public/assets') // give full path this will give error
    cb(null, os.tmpdir()) // multer store file in this for some time 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // logic to change file name
    cb(null, file.fieldname + '-' + uniqueSuffix)
    // cb(null, file.originalname)
  }
})

export const upload = multer({ storage })