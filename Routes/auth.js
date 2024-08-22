import express from 'express';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt,{ hash,genSalt  } from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchUser from '../middleware/fetch.js';
import upload, { uploader } from '../fileuploader/multerFile.js';
import Post from '../models/posts.js';
import cloudinary from '../fileuploader/cloudinaryConfig.js';
const router = express.Router();




router.post('/uploadcloud' , uploader.single('profileImage'),async(req,res)=>{
    try {
if(!req.file){
    return res.send('File not found !')
}

        console.log(req.file.filename);
    const posts = new Post({
        title : 'hi',
        description:'image',
        keywords:['image'],
        image :req.file.path
    });
    await posts.save()
    res.send({posts})
    } catch (error) {
        console.log(error);
    }
})





router.get('/allusers',async(req,res)=>{
    try {
        const users = await User.find({})
        if(users){
            return res.json({users});
        }
        res.json({error :'User is not exit'});
    } catch (error) {
        console.error(error);
    }
})



router.get('/user/info',fetchUser, async(req,res)=>{
    try {
   
    const userdata = await User.findById({_id : req.userId}).select('-password');
   
    res.send({userdata})
  
    
} catch (error) {
     console.log(error);    
}
})



router.post('/profileimage',fetchUser,uploader.single('profileImage'),async(req,res)=>{

 
        if(!req.file){
            return res.json({error : 'Upload image'})
        }
            
          
          const user = await User.findById({_id:req.userId})
        
          console.log(user)

         const publicId = user.publicId;

        if(publicId){
            await cloudinary.uploader.destroy(publicId);
            }

        const result = await cloudinary.uploader.upload(req.file.path);
        
          user.profileImage = result.secure_url;

        user.publicId = result.public_id;


        console.log(user);
        console.log(result);

          await user.save();
        res.json({filedata:req.file.path ,user, success :'Successfully Uploaded !'})
       
        



} )



router.put('/user/update',fetchUser , async(req,res)=>{
    let {username , bio ,email}=req.body;
  
try {
    const existingField = await User.findById({_id:req.userId});
   
    

    if(username ===''){
        username = existingField.username;
        
    
    }
   
    if(email ===''){
        
        email = existingField.email;
    
  
    }
   
    if(bio ===''){
        bio = existingField.bio;
       
    }

    const userData = await User.findByIdAndUpdate({_id:req.userId },{$set:{username,bio,email}});
    
    console.log(userData)
    return res.send({success :'Profile Updated Successfully !'});
 
} catch (error) {
    console.error(error);
    res.json({error :'Upadating Problem'})
}
})



router.post('/add',async(req,res)=>{
    const {username ,email,password,accountType} = req.body;
    const newUser = new User({
       username, email,password,accountType
    })    
    const saved = await newUser.save();
    res.json({saved});
})



router.post('/login', async (req, res) => {
    //* data comimg from body(frontend)
    const { email, password } = req.body

    try {
        //* Validation 
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        //* Email Validation 
        if (!email.includes("@")) {
            return res.status(400).json({ error: "Please enter a valid email" })
        }

        //* Find Unique User with email
        const user = await User.findOne({ email });

        console.log(user)

        //* if user not exists with that email
        if (!user) {
            return   res.status(400).json({ error: "User Not Found" })
        }

        //* matching user password to hash password with bcrypt.compare()
        const doMatch = await bcrypt.compare(password, user.password)
        console.log(doMatch)

        //* if match password then generate token 
        if (doMatch) {
            const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
                expiresIn: '7d'
            })

           return res.status(201).json({ token , success :'Login Success' })
        }
        else {
            res.status(404).json({ error: 'Email And Password Not Found' })
        }

    } catch (error) {
        console.log(error);
        return    res.status(500).send("Internal Server Error");
    }
})




router.post('/signup',async(req,res)=>{

    const {username,email,password}= req.body;
    try {
        const existUser = await User.findOne({email,username});
        if(existUser){
            return res.status(400).json({ error :'Account already exist !'});

        }
        if(!username || !email || password ===''){
          return  res.status(400).json({error:'Field is empty'})
        }

        const salt = bcrypt.genSalt(10)
        const newPass = await bcrypt.hash(password,parseInt(salt));

        const newUser = new User({
            username,
            email,
            password : newPass,
        });

        const Saved = await newUser.save(); 
        
        if(Saved) {
         return   res.status(200).json({ success : 'Successfully Registered ! '});
        }
    } catch (error) {
        console.log(error);
        return res.json({error  : 'Problem form internal !'});
    }

})



export default router;