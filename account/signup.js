const {SERVER} = require("../database/dynamodb");
const {nanoid} = require("nanoid");
const bcrypt = require("bcrypt");
const {createUser,sparseUser} = require("../database/tableItems");
const Response = require("../util/response");
const {validate} = require("../util/properties")
const { ResponseCode } = require("../util/responseCode");
const createAccount = async (username,password,userId,firstname,lastname) =>{
    try{
        const user = createUser(userId,username,password,firstname,lastname);
        await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:user
        }).promise();

        return {success:true,user:sparseUser(user)}
    }
    catch(error){ return {success:false,message:error.message,code:500}}
}

const signUp = async (username,password,firstname,lastname) =>{
    let hash,userId;
    try{
        hash = await bcrypt.hash(password,10);
        userId = nanoid();
    }
    catch(error){  return {success:false,message:error.message,code:500} }
    return createAccount(username,hash,userId,firstname,lastname);
}

exports.handlerAccount = async (event,context) =>{
    const validation = validate(["username","password","firstname","lastname"],event,"Create Account");
  
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }

    const item = validation.item;
    
    const result = await signUp(item.username,item.password,item.firstname,item.lastname);

    if(result.success){ return Response.create(200,result.user)}

    return Response.create(result.code,{message:result.message});
}