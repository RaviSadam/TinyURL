
const connect=(mongoose)=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>{console.log("Connected to DB")})
    .catch((err)=>{console.log("Error occured$$"+err)});
}
export default connect;
