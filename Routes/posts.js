import express from 'express'
import fetchUser from '../middleware/fetch.js';
import Post from '../models/posts.js';
import User from '../models/user.js';
import upload, { uploader } from '../fileuploader/multerFile.js';
import path from 'path'

const router = express.Router();

router.post('/imagedata',uploader.single('image'),(req,res)=>{
    console.log(req.body);
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({filedata : req.file.path , success:'Image is Uploaded !'});
    
})


router.post('/create' , fetchUser, async(req,res)=>{
const u_ID  =req.userId;

const {title,description,keywords ,filename} = req.body;

try {

    
    
    if(!title || !description || !keywords ||filename  ==='')  {
        return    res.status(400).json({error :'Please fill the all fields !'});
      }
    
    const newPost = new Post({
        title,
        description,
        keywords,
        user : u_ID,
        image:filename
    });


 
  const saved  =await newPost.save();
    
  if(saved){

   return res.status(200).json({success :'Successfully Upload !'});

  }

} catch (error) {
    return   res.status(401).json({error :'Server Error !'});
    console.error(error);

}

});



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










router.post('/delete/:post',fetchUser,async(req,res)=>{

    const postid = req.params.post;
    try {
        const data = await Post.findByIdAndDelete({_id :postid});
        console.log("Deleting Success !");
        res.json({success:'Successfully Deleted'});
    } catch (error) {
        console.error(error);
    }

});

//update 

router.post('/update/:post' ,fetchUser, async(req,res)=>{
    let {title,description,keywords}=req.body;
    const postid = req.params.post;
    const existingPost = await Post.findById({_id:postid});
    if(title===''){
        title= existingPost.title
    }
    if(description===''){
        description= existingPost.description
    }
    if(keywords===''){
        keywords= existingPost.keywords
    }

    

    try {
        const data = await Post.findByIdAndUpdate({_id : postid},{$set:{title,description,keywords}},{new:true});
        console.log({title,description,keywords});
        console.log(data);
        res.json({success:'updated post'});

    } catch (error) {
        console.error(error);
        res.json({error:'Post is not updated'})
    }
})




router.get('/user/posts',fetchUser,async(req,res)=>{
    try {
        const Uid = req.userId;
            const posts = await Post.find({user:Uid}).sort({date : -1});
            res.json({posts});
        } catch (error) {
            console.error(error);
        }
})

router.get('/view/post/:id', async(req,res)=>{
    const postid = req.params.id;
  try {

        const post = await Post.findById({_id : postid});
        res.json({post});
    } catch (error) {
        console.error(error)
    }

})


router.get('/view/all',async(req,res)=>{ 
    
    try {
        const allposts=await Post.find({}).sort({date:-1});
        
        res.json({allposts});

    } catch (error) {
        console.error(error);

    }
})




export default router;