const mongoose=require('mongoose');
const db=async(req,res)=>{
    try {
      mongoose.set('strictQuery', true);
      await  mongoose.connect(process.env.URI,{ useNewUrlParser: true,
      useUnifiedTopology: true, });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("++++++++++++++++++++",error);
    }
}
module.exports=db;


