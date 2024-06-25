import LocalStrategy from "passport-local";
import User from "../Database/UserSchema.mjs";



const customFields={
    usernameField:"username",
    passwordField:"password"
}

const verfiyCallback=async (username,password,done)=>{
    try{
        const user=await User.findOne({username:username},{username:1,password:1,_id:1});
        if(!user){
            return done(null,false,{message:"user not found"});
        }
        const isValid=await user.isValidPassword(password);
        if(!isValid){
            return done(null,false,{message:"Incorrect password"});
        }    
        return done(null,user);
    }
    catch(err){
        return done(err,false);
    }
}
const authenticateUser=(passport)=>{
    passport.use(new LocalStrategy(customFields,verfiyCallback));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}
export default authenticateUser;