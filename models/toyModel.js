const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema(
    {
        name: String,
        info: String,
        category: String,
        img_url: String,
        price: Number,
        date_created: {
            type: Date, default: Date.now
        },
        user_id: String
    }
)

exports.ToyModel = new mongoose.model("toys", schema);

exports.validateJoi = (_reqBody) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        info:Joi.string().min(2).max(999).required(),
        category:Joi.string().min(2).max(20).required(),
        img_url:Joi.string().min(2).max(99).allow("", null),
        price:Joi.number().min(1).max(2000).required(),
    })
    return joiSchema.validate(_reqBody);
}