import multer from 'multer'

import {v4 as uuidv4}  from 'uuid';

import path from 'path'
// cloudinary

import cloudinary from './cloudinaryConfig.js';

// import the multer storage cloudinary

import {CloudinaryStorage} from 'multer-storage-cloudinary';

const cloudStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
     folder:'images',
     allowedFormats:['jpg','png' ,'jpeg']   
    },

})

// creact uploader variable 

export const uploader = multer({storage : cloudStorage})


const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
    cb(null,'./backend/uploads/')
    },
    filename:(req,file,cb)=>{
        const unique = uuidv4();
        cb(null,unique+path.extname(file.originalname));
    }
});


const upload = multer({storage : storage});








export default upload  ;

