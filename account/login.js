const {SERVER} = require("../database/dynamodb")
const {generateToken} = require("../lib/authentication")
const bcrypt = require("bcrypt");
const Payload = require("./payload")
const {userParams} = require("../query/get")
const Response = require("../util/response");
const { ResponseCode } = require("../util/responseCode");


const tokenCreation = async (user,APP_KEY) =>{
    try{
        const payload = Payload.create(user.id,user.username,user.firstname,user.lastname);
        const token = generateToken(payload,APP_KEY);
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

const login = async (username,password,APP_KEY) =>{
    const result = await getUser(username);
    if(!result.hasUser){ return {success:false,message: result.message,code:result.code};}

    const user = result.user;
    try{
        const correctPassword = await bcrypt.compare(password,user.password);
        if(!correctPassword){ return {success:false,message:"Incorrect username or password",code:404};}
        return tokenCreation(user,APP_KEY);
    }
    catch(error){ return {success:false,message:error.message,code:500} }
}

exports.handlerLogin = async (event,context) =>{
    const validation = validate(["username","password"],event,"Login");
    if(!validation.passed){ return Response.create(400,{message:validation.message}); }
    if(!event.headers.APP_KEY === process.env.APP_KEY){return Response.failed(ResponseCode.UN_AUTHORIZED)}
    
    const APP_KEY = event.headers.APP_KEY;
    const item = validation.item;
    const result = await login(item.username,item.password,APP_KEY);
    if(result.success){ return Response.create(200,result) }
    return Response.create(result.code,{message:result.message});
}