const {SERVER,Response,middy,auth} = require("../../database/baseImports");
const {specificNoteAlive} = require("../../query/get");

const createQuery = async (username,noteId) =>{
    try{
        const params = specificNoteAlive(username,noteId);
        const {Item} = await SERVER.documentClient.get(params).promise();
        if(Item){ return {success:true,note:Item} }
        return {success:false,message:"No note with given id was found.",code:404};
    }
    catch(error){ return {success:false,message:`Get note failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const getNote = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    if(!event.pathParameters?.id){return Response.create(404,{message:"NoteId is not present in request."});}

    let result = await createQuery(event.user?.username,event.pathParameters?.id)
    if(result.success){ return Response.create(200,result.note)}
    return Response.create(result.code,{message:result.message});
}

const handler = middy(getNote)
                .use(auth);

module.exports = {handler};