const {SERVER} = require("../../database/dynamodb")
const {generateToken,verifyAppKey} = require("../../lib/authentication")
const bcrypt = require("bcryptjs");
const Payload = require("./payload")
const {userParams} = require("../../query/get")
const Response = require("../../util/response");
const {validate,PropCheck} = require("../../util/properties");
const { ResponseCode } = require("../../util/responseCode");


const tokenCreation = async (user,app_key) =>{
    try{
        const payload = Payload.create(user.id,user.username);
        const token = generateToken(payload,app_key);
        return {success:true,token:token}
    }
    catch(error){ return {success:false,message:error.message,code:500}}
}

const getUser = async (username) =>{
    try{
        const params = userParams(username);
        const {Item} = await SERVER.documentClient.get(params).promise();
        if(Item){ return {hasUser:true,user:Item} }
        return {hasUser:false,message:"Incorrect username or password",code:404};
    }
    catch(error){ return {hasUser:false,message:error.message,code:500}; }
}

const login = async (username,password,app_key) =>{
    const result = await getUser(username);
    if(!result.hasUser){ return {success:false,message: result.message,code:result.code};}

    const user = result.user;
    try{
        const correctPassword = await bcrypt.compare(password,user.password);
        if(!correctPassword){ return {success:false,message:"Incorrect username or password",code:404};}
        return tokenCreation(user,app_key);
    }
    catch(error){ return {success:false,message:error.message,code:500} }
}

exports.handler = async (event,context) =>{
    if(!verifyAppKey(event)){return Response.failed(ResponseCode.UN_AUTHORIZED)}
    const properties = [
        {prop:"username",toCheck:[]},
        {prop:"password",toCheck:[]}];
    
    const validation = validate(
        properties,
        event?.body,
        "Login");
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }

    const item = validation.item;
    const result = await login(item.username,item.password,event?.headers["app_key"]);
    if(result.success){ return Response.create(200,result) }
    return Response.create(result.code,{message:result.message});
}