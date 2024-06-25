import mongoose from "mongoose";
import crypto from "crypto";
import {compressString} from "../EncyAndDecy.mjs";
import { type } from "os";

const {Schema,model}=mongoose;

const urlSchema=new Schema({
    code:{
        type:String,
        unique:true,
        require:true
    },
    original:{
        type:String,
        require:true,
        unique:true
    },
    totalTimesRequested:{
        type:Number,
        default:0
    },
    domine:{
        type:String
    },
    username:{
        type:String
    }
});

function generateUniqueString(){
    const buffer = crypto.randomBytes(10);
    const uniqueString = buffer.toString("HEX").slice(0,10);
    return uniqueString;
}


urlSchema.pre("save",async function(next){
    this.code=generateUniqueString();
    next();
});



export default model("Url",urlSchema);

