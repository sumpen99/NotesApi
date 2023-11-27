const {SERVER,Response,middy,auth} = require("../../database/baseImports");
const {allNotesAlive} = require("../../query/get");

const createQuery = async (username) =>{
    try{
        const params = allNotesAlive(username);
        const {Items} = await SERVER.documentClient.query(params).promise()
        if(Items){return {success:true,notes:Items}}
        return {success:true,note:{message:"You have no current saved notes. Post one and try again."}}
    }
    catch(error){ 
        return {success:false,message:`Get notes failed with internal error -> [ ${error.message} ]`,code:500}
    }
}

const getNotes = async (event,context) =>{
    if(event.error){return Response.failed(event.error);}
    let result = await createQuery(event.user?.username)
    if(result.success){ return Response.create(200,result.notes)}
    return Response.create(result.code,{message:result.message});
}

const handler = middy(getNotes)
                .use(auth);

module.exports = {handler};