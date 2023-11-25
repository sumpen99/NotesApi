const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");

const putNotes = async (event,context) =>{
    return Response.create(200,result)
}

const handler = middy(putNotes)
                .use(validateToken);

module.exports = {handler};