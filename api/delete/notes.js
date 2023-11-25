const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");

const deleteNotes = async (event,context) =>{
    return Response.create(200,result)
}

const handler = middy(deleteNotes)
                .use(validateToken);

module.exports = {handler};