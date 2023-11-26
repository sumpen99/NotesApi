const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");
const auth = require("../../middlewares/auth");

const postNotes = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    return Response.create(200,{success:true,user:event?.user});
}

const handler = middy(postNotes)
                .use(auth);

module.exports = {handler};