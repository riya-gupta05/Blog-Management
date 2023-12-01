const BlogSetting= require('../models/blogSettingModel');
const User= require('../models/userModel');
const Post= require('../models/postModel');
const bcrypt=require('bcrypt');

const securePassword=async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}


const blogSetup=async(req,res)=>{
    try{
        var blogSetting = await BlogSetting.find({});
        if(blogSetting.length>0){
            // res.redirect('/login');
        // }else{
            res.render('blogSetup');
        }
    }catch(error){
        console.log(error)
    }
}

const blogSetupSave= async(req,res)=>{
    try{
        const blog_title=req.body.blog_title;
        const blog_image=req.file.blog_image;
        const description=req.body.description;
        const email=req.body.email;
        const name=req.body.name;
        const password = await securePassword(req.body.password);

        const blogSetting= new BlogSetting({
            blog_title:blog_title,
            blog_logo:blog_image,
            description:description
        });

        await blogSetting.save();

        const user = new User({
            name:name,
            email:email,
            password:password,
            is_admin:1
        });

        const userData = await user.save();
        if(userData){
            res.redirect('/login');
        }else{
            res.render('blogSetup',{message:'Blog not setup properly!'});
        }
    }catch(error){
        console.log(error.message);
    }
}

const dashboard = async(req,res)=>{
    try{
        const allPosts = await Post.find({});
        res.render('admin/dashboard',{posts:allPosts});
    }catch(error){
        console.log(error.message);
    }
}

const loadPostDashboard = async(req,res)=>{
    try{
        res.render('admin/postDashboard');
    }catch(error){
        console.log(error.message);
    }
}

const addPost = async(req,res)=>{
    try{
        const post = new Post({
            title: req.body.title,
            content: req.body.content 
        });
        const postData = await post.save();
        res.render('admin/postDashboard',{message:'Post added Successfully!'});
    }catch(error){
        console.log(error.message);
    }
}

const deletePost = async(req,res)=>{
    try{
        await Post.findOneAndDelete({ _id:req.body.id });
        res.status(200).send({success:true,msg:'Post Deleted Successfully!'});
    }catch(error){
        res.status(400).send({success:false,msg:error.message});
    }
}

const updatePost = async(req,res)=>{
    try{
        await Post.findByIdAndUpdate({ _id:req.body.id },{
            $set:{
                title: req.body.title,
                content: req.body.content
            }
        });
        res.status(200).send({success:true,msg:'Post Updated Successfully!'});
    }catch(error){
        res.status(400).send({success:false,msg:error.message});
    }
}

const loadEditPost = async(req,res)=>{
    try{
       var postData = await Post.findOne({ _id: req.params.id });
       res.render('admin/editPost',{post:postData});
    }catch(error){
        console.log(error.message);
    }
}

module.exports={
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addPost,
    deletePost,
    loadEditPost,
    updatePost
}