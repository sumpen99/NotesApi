const {nanoid} = require("nanoid");

const baseItemPropertie = () =>{
    let id = nanoid();
    let createdAt = new Date();
    return {
        id:id,
        createdAt:createdAt
    }
}

const createUser = (username,password,email,firstname,lastname) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${username}`,
        id:id,
        username:username,
        password:password,
        email:email,
        firstname:firstname,
        lastname:lastname,
        createdAt:createdAt
    }
}

const addAccount = (username,accountname,password,email,firstname,lastname) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}`,
        id:id,
        username:username,
        password:password,
        email:email,
        firstname:firstname,
        lastname:lastname,
        createdAt:createdAt
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

const createInitialNote = (username,accountname,title,text) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}#NOTE#ALIVE#${id}`,
        id:id,
        title:title,
        text:text,
        createdAt:createdAt
    }
}

const createUpdatedNote = (username,accountname,note,title,text) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}#NOTE#ALIVE#${note.id}`,
        id:note.id,
        title:title,
        text:text,
        createdAt:note.createdAt,
        updatedAt:createdAt
    }
}

const createDeletedNote = (username,accountname,note) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}#NOTE#DELETED#${note.id}`,
        id:note.id,
        title:note.title,
        text:note.text,
        createdAt:note.createdAt,
        deletedAt:createdAt
    }
}

const createRestoredNote = (username,accountname,note,title,text) =>{
    const {id,createdAt} = baseItemPropertie();
    return {
        PK:`USER#${username}`,
        SK:`ACCOUNT#${accountname}#NOTE#ALIVE#${note.id}`,
        id:note.id,
        title:note.title,
        text:note.text,
        createdAt:note.createdAt,
        restoredAt:createdAt
    }
}

const sparseNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt
    }
}

module.exports = {
    createUser,
    createInitialNote,
    sparseUser,
    sparseNote,
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