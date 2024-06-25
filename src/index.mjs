
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";

import connect from "./Database/db.mjs";
import authenticateUser from "./Authentication/user_authentication.mjs";
import url_router from "./url_routes.mjs";
import user_router from "./user_routes.mjs";
import {connectRedis} from "./redis-cache/connect-redis.mjs";


dotenv.config();

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    saveUninitialized:false,
    resave:false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGOOSE_URL,
        ttl:14*24*60*60,
        autoRemove:'native',
        crypto:{
            secret:process.env.SESSION_SECRET_KEY,
        }
    }),
}));

app.use(passport.initialize());
app.use(passport.session());


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


app.use("/shorter",url_router);
app.use("/user",user_router);
app.all("/",(req,res)=>{
    res.render("home",{isAuthenticated:req.isAuthenticated()});
});

app.listen(process.env.PORT,async ()=>{
    await connect(mongoose);
    authenticateUser(passport);
    await connectRedis();
    console.log("Server started and initialization done");
});