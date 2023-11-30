const {SERVER,Response,middy,auth,ResponseCode} = require("../../database/baseImports");
const {specificNoteToRestoreFromTrash} = require("../../query/get");
const {createRestoredNote,sparseRestoredNote} = require("../../database/tableItems")

const executeMove = async (username,note) =>{
    try{
        const restoredNote = createRestoredNote(username,note);
        const dbResponse = await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:restoredNote,
       }).promise()
       return {success:true,note:sparseRestoredNote(restoredNote)}
    }
    catch(error){ return {success:false,message:`Delete note failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const executeDelete = async (username,noteId) =>{
    try{
        const params = specificNoteToRestoreFromTrash(username,noteId);
        const {Attributes} = await SERVER.documentClient.delete(params).promise();
        if(Attributes){ return executeMove(username,Attributes); }
        return {success:false,message:"No deleted note with given id was found.",code:404};
    }
    catch(error){ return {success:false,message:`Restore note failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const restoreAndMoveNote = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    if(!event.pathParameters?.id){return Response.failed(ResponseCode.NOT_FOUND)}

    let user = event.user,id = event.pathParameters.id;
    let result = await executeDelete(user.username,id);
    if(result.success){ return Response.create(200,result.note) }
    return Response.failed({data:result});
}

const handler = middy(restoreAndMoveNote)
                .use(auth);

module.exports = {handler};