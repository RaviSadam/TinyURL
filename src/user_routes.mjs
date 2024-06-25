import express from "express";
import User from "./Database/UserSchema.mjs";
import passport from "passport";
import Url  from "./Database/UrlSchema.mjs"

const {Router}=express;

const router=Router();

router.get("/register",(req,res)=>{
    res.render("registration");
});

router.post("/register",async (req,res)=>{
    const user=new User(req.body);
    await user.save();
    res.send("OK");
});

router.get("/login",(req,res)=>{
    let query="";
    if(req.query){
        query=req.query;
    }
    res.render(`login`);
});

router.post("/login",(req,res,next)=>{
    passport.authenticate('local',{failureRedirect:"/authFail"},(err,user,info)=>{
        if(err)
            return next(err);
        if(!user){
            return res.status(401).json({body:"Unauthorized request"});
        }
        req.logIn(user,async (err)=>{
            if(err)
                return next(err);
            return next(null,user);
        });
    })(req,res,next);
},(req,res)=>{
    if(req.query.next){
        res.redirect(req.query.next);
    }
    else{
        res.redirect("/");
    }
});
router.put("/update/:username",async (req,res)=>{
    const username=req.params.username.trim();
    if(!username || username.length<1)
        return res.status(400).json({body:"username requried"});
    const user=await User.findOneAndUpdate({username:username},req.body);
    await user.save();
    res.send("OK");
});

router.get("/urls",async (req,res)=>{
    if(!req.isAuthenticated())
        return res.redirect(`/user/login/?next=/user/urls`);
    const pageNumber=req.query.pageNumber|1;
    const pageSize=req.query.pageSize|10;
    const skip=(pageNumber-1)*pageSize;
    const urls=await Url.find({username:req.user.username},{_id:0,username:0,original:0,__v:0}).skip(skip).limit(pageSize);
    res.json({body:urls});
});

router.delete("/delete",async (req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/user/login/?next=/user/delete");
    }
    const name=req.user.username;
    if(!name){
        res.status(400).json({response:"username requried"});
        next();
        return;
    }
    
    try{
        const user=await User.findOneAndDelete({username:name});
        if(user)
            res.status(200).json({response:"user deleted"});
        else
            res.status(404).json({response:`no user fonund with give username ${name}`});
    }
    catch(err){
        res.status(500).json({response:"unknown error occured"});
    }
    res.end();
});

router.all("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
            next(err);
        res.render("login");
    });
});
export default router;