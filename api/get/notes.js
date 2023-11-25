const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");

const getNotes = async (event,context) =>{
    return Response.create(200,result)
}

const handler = middy(getNotes)
                .use(validateToken);

module.exports = {handler};