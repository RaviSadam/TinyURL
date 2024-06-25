import {createClient} from "redis";

let client;
const cache_expitation_time=process.env.CACHE_EXPIRATION_TIME

export const connectRedis=async ()=>{
    client=await createClient({
        
        password:process.env.REDIS_PASSWORD,
        username:process.env.REDIS_USERNAME,
        socket:{
            host:process.env.REDIS_HOST,
            port:10287
        }  
    })
    .on('error',(err)=>console.log("Error occured while connecting to redis",err))
    .on('connect',()=>console.log("Connected to redis"))
    .connect();

};
export const setKey=async (key,value)=>{
    await client.set(key,value,{
        EX:cache_expitation_time,
        NX:true
    });
};

export const getValue=async (key)=>{
    return await client.get(key);
};