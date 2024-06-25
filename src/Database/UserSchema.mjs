
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passportLocalMongoose from "passport-local-mongoose";

const {Schema,model}=mongoose;
const addressSchema=new Schema({
    village:{
        type:String
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    pincode:{
        type:Number,
        match:[/^[0-9]{6}$/,'Invalid PIN code is given']
    },
    state:{
        type:String
    },
    country:{
        type:String
    }
},
{
    _id:false,
});

const userSchema=new Schema({
    username:{
        type:String,
        lowercase:true,
        minLength:5,
        maxLength:20,
        require:true,
        unique:true,
        mutable:false,
        trim:true
    },
    password:{
        type:String
    },
    roles:[{type:String}],
    age:{
        type:Number,
        min:1,
        max:80,
        require:false
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        match:[
            /^[\w.-]+@[\w.-]+\.\w{2,3}$/,
            'Please provide a valid email address',
        ],
        mutable:false,
    },
    phone:{
        type:String,
        require:false,
        match:[/^(\+([1-9]{1,2}))?([1-9][0-9]{9})$/,'Invalid Modile Number']
    },
    firstName:{
        type:String,
        require:true,
        minLength:3,
        maxLength:30    
    },
    lastName:{
        type:String,
        require:false
    },
    createdDate:{
        type:Date,
        default:()=>Date.now(),
        mutable:false
    },
    updatedDate:{
        type:Date,
        default:()=>Date.now()
    },
    
    panNumber:{
        type:String,
        require:false,
        unique:true,
        match:[/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,'Invalid Pan number']
    },
    hobbies:[{type:String}],
    address:addressSchema,
});

userSchema.pre("save",async function(next){
    this.password=await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isValidPassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.plugin(passportLocalMongoose);


export default model("User",userSchema);