import { Router } from "express";
import Url from "./Database/UrlSchema.mjs";
import { decompressString,compressString } from "./EncyAndDecy.mjs";
import {getValue,setKey} from "./redis-cache/connect-redis.mjs";

const router=Router();

//shorter request
router.post("/",async (req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/user/login/?next=/shorter");
    }
    const original=await compressString(req.body.original);
    let response=await Url.findOne({original:original});
    if(!response){
        const domine=req.body.domine;
        const url=new Url({domine:domine,original:original,username:req.user.username});
        response=await url.save();
    }
    res.json({body:`${process.env.DOMINE}/${response.code}`});
});

router.get("/",(req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/user/login/?next=/shorter");
    }
    res.render("shorter");
});

router.get("/:code",async(req,res)=>{

    const code=req.params.code.trim();
    if(!req.isAuthenticated()){
        return res.redirect(`/user/login/?next=/shorter/${code}`);
    }
    
    if(!code){
        return res.status(400).send("Invalid reqiest");
    }
    const value=await getValue(code); 
    if(value!==null)
        return res.redirect(value);
    const url=await Url.findOneAndUpdate({code:code},{$inc:{totalTimesRequested:1}});
    if(!url){
        return res.status(404).send("No url was found");
    }
    const original=await decompressString(url.original);
    await setKey(code,original);
    res.redirect(original);
});
export default router;