const {SERVER} = require("../../database/dynamodb");
const {nanoid} = require("nanoid");
const bcrypt = require("bcryptjs");
const {createUser,sparseUser} = require("../../database/tableItems");
const Response = require("../../util/response");
const {validate,PropCheck} = require("../../util/properties");
const {ResponseCode} = require("../../util/responseCode");

const createAccount = async (username,password,userId,email,firstname,lastname) =>{
    const user = createUser(userId,username,password,email,firstname,lastname);
    try{
        const result = await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:user,
            ConditionExpression:
            "attribute_not_exists(username) AND attribute_not_exists(email)",
        }).promise()
        console.log(result);
        return {success:true,user:sparseUser(user)}
    }
    catch(error){ return {success:false,message:error.message,code:500}}
    
}

const signUp = async (username,password,email,firstname,lastname) =>{
    let hash,userId;
    try{
        hash = await bcrypt.hash(password,10);
        userId = nanoid();
    }
    catch(error){  return {success:false,message:error.message,code:500} }
    return createAccount(username,hash,userId,email,firstname,lastname);
}

exports.handler = async (event,context) =>{
    const validation = validate([
        {prop:"username",toCheck:[{type:PropCheck.MIN_LENGTH,value:3},{type:PropCheck.MAX_LENGTH,value:255}]},
        {prop:"email",toCheck:[{type:PropCheck.EMAIL,value:""}]},
        {prop:"password",toCheck:[{type:PropCheck.PASSWORD,value:""}]},
        {prop:"firstname",toCheck:{type:PropCheck.MAX_LENGTH,value:255}},
        {prop:"lastname",toCheck:{type:PropCheck.MAX_LENGTH,value:255}}],
        event,"Create Account");
  
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }
    if(!event?.headers["APP_KEY"] === process.env.APP_KEY){return Response.failed(ResponseCode.UN_AUTHORIZED)}

    const item = validation.item;
    
    const result = await signUp(item.username,item.password,item.email,item.firstname,item.lastname);

    if(result.success){ return Response.create(200,result.user)}

    return Response.create(result.code,{message:result.message});
}