const {SERVER,Response,middy,auth,ResponseCode} = require("../../database/baseImports");
const {specificNoteDeleted} = require("../../query/get");

const createQuery = async (username,noteId) =>{
    try{
        const params = specificNoteDeleted(username,noteId);
        const {Item} = await SERVER.documentClient.get(params).promise();
        if(Item){ return {success:true,note:Item} }
        return {success:false,message:"No deleted note with given id was found.",code:404};
    }
    catch(error){ return {success:false,message:`Get note deleted failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const getDeletedNote = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    if(!event.pathParameters?.id){return Response.failed(ResponseCode.NOT_FOUND);}

    let result = await createQuery(event.user.username,event.pathParameters.id)
    if(result.success){ return Response.create(200,result.note)}
    return Response.failed({data:result});
}

const handler = middy(getDeletedNote)
                .use(auth);

module.exports = {handler};