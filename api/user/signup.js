const {SERVER,Response,validate,PropCheck} = require("../../database/baseImports");
const {ResponseCode} = require("../../util/responseCode");
const bcrypt = require("bcryptjs");
const {createUser,sparseUser} = require("../../database/tableItems");
const {verifyAppKey} = require("../../lib/authentication");

const createAccount = async (username,password,email,firstname,lastname) =>{
    const user = createUser(username,password,email,firstname,lastname);
    try{
        const result = await SERVER.documentClient.put({
            TableName:process.env.DYNAMO_DB_TABLE,
            Item:user,
            ConditionExpression:
            "attribute_not_exists(PK) AND attribute_not_exists(SK)",
        }).promise()
        return {success:true,user:sparseUser(user)}
    }
    catch(error){ 
        if(error.code === "ConditionalCheckFailedException"){
            return {success:false,message:`Create account failed. User already exists in database`,code:400}   
        }
        return {success:false,message:`Create account failed with internal error -> [ ${error.message} ]`,code:500}
    }
    
}

const signUp = async (username,password,email,firstname,lastname) =>{
    try{
        let hash = await bcrypt.hash(password,10);
        return createAccount(username,hash,email,firstname,lastname);
    }
    catch(error){  return {success:false,message:error.message,code:500} }
    
}

const validateInput = (body) =>{
    const properties = [
        {prop:"username",toCheck:[{type:PropCheck.MIN_LENGTH,value:3},{type:PropCheck.MAX_LENGTH,value:255}]},
        {prop:"email",toCheck:[{type:PropCheck.EMAIL,value:""}]},
        {prop:"password",toCheck:[{type:PropCheck.PASSWORD,value:""}]},
        {prop:"firstname",toCheck:[{type:PropCheck.MAX_LENGTH,value:255}]},
        {prop:"lastname",toCheck:[{type:PropCheck.MAX_LENGTH,value:255}]}
    ];
    
    const validation = validate(
        properties,
        body,
        "Create Account");

    return validation;
}

exports.handler = async (event,context) =>{
    if(!verifyAppKey(event)){return Response.failed(ResponseCode.UN_AUTHORIZED);}
    
    const validation = validateInput(event?.body);
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }

    const item = validation.item;
    
    const result = await signUp(item.username,item.password,item.email,item.firstname,item.lastname);

    if(result.success){ return Response.create(200,result.user)}

    return Response.create(result.code,{message:result.message});
}