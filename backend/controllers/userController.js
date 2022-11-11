const User=require('../models/User')
const Note=require('../models/Note')
const asyncHandler=require('express-async-handler')
const bcrypt=require('bcrypt')


//@ desc get all users
//@ route GET /users
//@access Private
const getAllUsers=asyncHandler(async(req,res)=>{
const users=await User.find().select('-password').lean()
if(!users.length){
    return res.status(400).json({msg:"No users found"})
}
res.json(users)
})
//@ desc create new user
//@ route POST /users
//@access Private
const createNewUser=asyncHandler(async(req,res)=>{
const {username,password,roles}=req.body;

// Confirm Data
if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({msg:"all fields are required!"})
}
// check duplicate
const duplicate=await User.findOne({username}).lean().exec()
if(duplicate){
    return res.status(409).json({msg:'Duplicate user'})
}
// Hash password
const hashPass=await bcrypt.hash(password,10)
const userObject={username,"password":hashPass,roles}
// Create and store a new user
const user=await User.create(userObject)
res.status(201).json({msg:`New user ${username} created`})
})

//@ desc update a user
//@ route PATCH /users
//@access Private
const updateUser=asyncHandler(async(req,res)=>{
const {id,username,roles,password,active}=req.body
// Confirm data
if(!id || ! username || !Array.isArray(roles) || !roles.length || typeof active !=='boolean'){
    return res.status(400).json({msg:"All fields are required"})
}
const user=await User.findById(id).exec()
if(!user){
    return res.status(400).json({msg:'user not found'})
}
// Check duplicate
const duplicate=await User.findOne({username}).lean().exec()
if(duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({msg:'Duplicate username'})
}
user.username=username;
user.roles=roles;
user.active=active
if(password){
    // hash password
    user.password=await bcrypt.hash(password,10)
}
const updateUser=await user.save()
res.json({msg:`${updateUser.username} updated`})
})

//@ desc delete a user
//@ route DELETE /users
//@access Private
const deleteUser=asyncHandler(async(req,res)=>{
const {id}=req.body
if(!id){
    return res.status(400).json({msg:'User ID is Required'})
}
const note=await Note.findOne({user:id}).exec()
if(note){
    return res.status(400).json({msg:'User has assigned notes'})
}
const user= await User.findById(id).exec()
if(!user){
    return res.status(400).json({msg:"User not found"})
}
const result=await user.deleteOne()
res.json({msg:`Username ${result.username} with ID ${result._id} deleted `})
})
module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}