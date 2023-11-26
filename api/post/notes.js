const {SERVER} = require("../../database/dynamodb");
const Response = require("../../util/response");
const middy = require("@middy/core");
const auth = require("../../middlewares/auth");
const {validate,PropCheck} = require("../../util/properties");
const {createInitialNote,sparseNote} = require("../../database/tableItems");

const postNote = async (username,title,text) =>{
    const note = createInitialNote(username,username,title,text);
    try{
        const result = await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:note,
            ConditionExpression:
            "attribute_not_exists(SK)",
        }).promise()
        return {success:true,note:sparseNote(note)}
    }
    catch(error){ 
        if(error.code === "ConditionalCheckFailedException"){
            return {success:false,message:`Post note failed. Item already exists in database`,code:400}   
        }
        return {success:false,message:`Post note failed with internal error`,code:500}
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
        "Post Note");
    return validation;
}

const postNotes = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}

    const validation = validateInput(event?.body);
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }
    
    let item = validation.item;
    let result = await postNote(event?.user.username,item?.title,item?.text)
    if(result.success){ return Response.create(200,result.note)}
    return Response.create(result.code,{message:result.message});
}

const handler = middy(postNotes)
                .use(auth);

module.exports = {handler};