const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

let schema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    date_created: {
        type: Date, default: Date.now
    }
})

exports.UserModel = new mongoose.model("users",schema);

exports.createToken = (user_id) => {
    let token = jwt.sign({_id:user_id}, config.tokenSecret, {expiresIn:"60mins"});
    return token;
}

exports.validateJoi = (_reqBody)=>{
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        email:Joi.string().email().min(6).max(99).required(),
        password:Joi.string().min(6).max(99).required(),
        role:Joi.string().min(4).max(99).allow("", null)
    })
    return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email:Joi.string().email().min(6).max(99).required(),
        password:Joi.string().min(6).max(99).required()
    })
    return joiSchema.validate(_reqBody)
}