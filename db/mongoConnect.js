const mongoose = require("mongoose");
const { config } = require("../config/secret");

main().catch(err => {
    console.log(err);
})

async function main(){
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongoURL);
    console.log("mongo connect toys_project")
}