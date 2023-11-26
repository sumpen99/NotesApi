const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");
const auth = require("../../middlewares/auth");

const postNotes = async (event,context) =>{
    console.log(event);
    return Response.create(200,result)
}

const handler = middy(postNotes)
                .use(auth);

module.exports = {handler};