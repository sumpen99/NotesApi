const {SERVER,Response,middy,auth,validate,PropCheck,ResponseCode} = require("../../database/baseImports");
const {sparseUpdatedNote} = require("../../database/tableItems");
const {noteParams} = require("../../query/update")

const updateNote = async (username,item,noteId) =>{
    const params = noteParams(username,item,noteId);
    try{
        const dbResponse = await SERVER.documentClient.update(params).promise();
        return {success:true,note:sparseUpdatedNote(dbResponse.Attributes)}
    }
    catch(error){ 
        if(error.code === "ConditionalCheckFailedException"){
            return {success:false,message:`Update note failed. No note with given id exists in database`,code:400}   
        }
        return {success:false,message:`Put note failed with internal error -> [ ${error.message} ]`,code:500}
    }
    
}

const validateInput = (body) =>{
    const properties = [
        {prop:"title",toCheck:[{type:PropCheck.MAX_LENGTH,value:50}]},
        {prop:"text",toCheck:[{type:PropCheck.MAX_LENGTH,value:300}]}
    ];
    const validation = validate(
        properties,
        body,
        "Update Note",
        1);
    return validation;
}

const createResponseMessage = (note,meta) =>{
    var message = "Note updated";
    if(meta.hasErrors && meta.errorMessage){
        message += ` but all changes could not be applied. Encountered following errors -> ${meta.errorMessage}`;
    }
    let data = {
        message:message,
        note:note
    }
    return data;
}

const putNote = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    if(!event.pathParameters?.id){return Response.failed(ResponseCode.NOT_FOUND)}

    const validation = validateInput(event.body);
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }
    
    let item = validation.item;
    let meta = validation.meta;
    let noteId = event.pathParameters.id;
    let result = await updateNote(event.user.username,item,noteId);
    if(result.success){
        let data = createResponseMessage(result.note,meta);
        return Response.create(200,data)
    }
    return Response.failed({data:result});
}

const handler = middy(putNote)
                .use(auth);

module.exports = {handler};