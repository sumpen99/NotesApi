const {SERVER,Response,middy,auth,ResponseCode} = require("../../database/baseImports");
const {specificNoteToMoveToTrash} = require("../../query/get");
const {createDeletedNote,sparseDeletedNote} = require("../../database/tableItems")

const executeMove = async (username,note) =>{
    try{
        const deletedNote = createDeletedNote(username,note);
        const dbResponse = await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:deletedNote,
       }).promise()
       return {success:true,note:sparseDeletedNote(deletedNote)}
    }
    catch(error){ return {success:false,message:`Delete note failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const executeDelete = async (username,noteId) =>{
    try{
        const params = specificNoteToMoveToTrash(username,noteId);
        const {Attributes} = await SERVER.documentClient.delete(params).promise();
        if(Attributes){ return executeMove(username,Attributes); }
        return {success:false,message:"No note with given id was found.",code:404};
    }
    catch(error){ return {success:false,message:`Delete note failed with internal error -> [ ${error.message} ]`,code:500}; }
}

const deleteAndMoveNote = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    if(!event.pathParameters?.id){return Response.failed(ResponseCode.NOT_FOUND)}

    let user = event.user,id = event.pathParameters.id;
    let result = await executeDelete(user.username,id);
    if(result.success){ return Response.create(200,result.note) }
    return Response.failed({data:result});
}

const handler = middy(deleteAndMoveNote)
                .use(auth);

module.exports = {handler};