import mongoose, { Types ,Schema ,model} from "mongoose";

const { ObjectId  } = mongoose.Schema.Types;
const postSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    keywords: [String] // Array of strings for keywords
  ,
    image :{
      type:String
      
    }
  ,
  user:{
    type:ObjectId,
    ref:'User'
  },
  date :{
    type : Date,
    default:Date.now()
  }
  });
  
  const Post = model('Post', postSchema);
  
  
  Post.createIndexes();
  export default Post;
  