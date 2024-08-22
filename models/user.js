import mongoose, { Types ,Schema ,model} from "mongoose";

const { ObjectId  } = Schema.Types;



const userSchema = new Schema({

  username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    bio:{
      type:String,
        
    },
    profileImage:{
      type:String
    }
    ,
    publicId:{
      type:String
    }
    ,
     date :{
      type:Date,
      default:Date.now
     }  
  });
  
const User = model('User',userSchema);
User.createIndexes();


export default User;
