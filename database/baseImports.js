const {SERVER} = require("./dynamodb");
const Response = require("../util/response");
const middy = require("@middy/core");
const auth = require("../middlewares/auth");
const {validate,PropCheck} = require("../util/properties");

module.exports = {
    SERVER,
    Response,
    middy,
    auth,
    validate,
    PropCheck
}