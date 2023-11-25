const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");

const postNotes = async (event,context) =>{
    return Response.create(200,result)
}

const handler = middy(postNotes)
                .use(validateToken);

module.exports = {handler};