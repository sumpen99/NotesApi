const createUser = (userId,username,password,email,firstname,lastname) =>{
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${username}`,
        id:userId,
        username:username,
        password:password,
        email:email,
        firstname:firstname,
        lastname:lastname,
        createdAt:new Date()
    }
}

const addUserAccount = (userId,username,accountname,password,email,firstname,lastname) =>{
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}`,
        id:userId,
        username:username,
        password:password,
        email:email,
        firstname:firstname,
        lastname:lastname,
        createdAt:new Date()
    }
}

const sparseUser = (user) =>{
    return {
        id:user.id,
        username:user.username,
        firstname:user.firstname,
        lastname:user.lastname,
        email:user.email,
        createdAt:user.createdAt
    }
}

const createNote = (username,account,noteId,title,text) =>{
    const createdAt = new Date();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${account}#NOTE#ALIVE#${noteId}`,
        id:noteId,
        title:title,
        text:text,
        createdAt:createdAt
    }
}

module.exports = {
    createUser,
    createNote,
    sparseUser,
}

/*
const user = {
    PK:"",
    SK:"",
    id:"",
    username:"",
    password:"",
    email:"",
    firstname:"",
    lastname:"",
    dateOfCreation:Date()
}

const note = {
    PK:"",
    SK:"",
    id:"",
    title:"",
    text:"",
    createdAt:Date(),
    modifiedAt:Date(),
}
*******************************************
GET USER
PK = USER#{username}
SK = ACCOUNT#{email}
*******************************************
GET ALL NOTES  
PK = USER#{username}
SK BEGINS WITH NOTE#ALIVE
*******************************************
GET SPECIFIC NOTE 
PK = USER#{username}
SK = NOTE#ALIVE#ID
FILTER: CREATED_AT,MODIFIED_AT ETC.
*******************************************
GET ALL DELETED NOTES
PK = USER#{username}
SK BEGINS WITH NOTE#DELETED
*******************************************
GET SPECIFIC DELETED NOTE
PK = USER#{username}
SK = NOTE#DELETED#ID
FILTER: DELETED_AT ->(CREATED_AT?)
*******************************************
*/