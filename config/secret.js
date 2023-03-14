require("dotenv").config();

exports.config = {
    tokenSecret:process.env.TOKENSECRET,
    mongoURL:process.env.MONGOURL
}