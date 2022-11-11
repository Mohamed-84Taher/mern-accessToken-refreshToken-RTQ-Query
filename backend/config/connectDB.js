const mongoose=require('mongoose')

const connectDB=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URI)
  
} catch (error) {
    console.log('db not connected')
    console.log('error :',error.stack)
}
}
module.exports=connectDB