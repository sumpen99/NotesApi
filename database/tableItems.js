const {nanoid} = require("nanoid");

const baseItemPropertie = (username) =>{
    let id = nanoid();
    let createdAt = new Date().toISOString();
    return {
        id:id,
        upperCasedUsername:username.toUpperCase(),
        createdAt:createdAt
    }
}

const createUser = (username,password,email,firstname,lastname) =>{
    const {id,upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`ACCOUNT`,
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

const createInitialNote = (username,title,text) =>{
    const {id,upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`NOTE#ALIVE#${id}`,
        id:id,
        title:title,
        text:text,
        createdAt:createdAt
    }
}

const createUpdatedNote = (username,note,title,text) =>{
    const {upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`NOTE#ALIVE#${note.id}`,
        id:note.id,
        title:title,
        text:text,
        createdAt:note.createdAt,
        updatedAt:createdAt
    }
}

const createDeletedNote = (username,note) =>{
    const {upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`NOTE#DELETED#${note.id}`,
        id:note.id,
        title:note.title,
        text:note.text,
        createdAt:note.createdAt,
        updatedAt:note.updatedAt ?? note.createdAt,
        deletedAt:createdAt
    }
}

const createRestoredNote = (username,note) =>{
    const {upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`NOTE#ALIVE#${note.id}`,
        id:note.id,
        title:note.title,
        text:note.text,
        createdAt:note.createdAt,
        restoredAt:createdAt,
        updatedAt:createdAt
    }
}

const sparseNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt
    }
}

const sparseDeletedNote = (note) =>{
    return {
        id:note.id,
        deletedAt:note.deletedAt
    }
}

const sparseRestoredNote = (note) =>{
    return {
        id:note.id,
        restoredAt:note.restoredAt
    }
}

module.exports = {
    createUser,
    createInitialNote,
    createDeletedNote,
    createRestoredNote,
    sparseDeletedNote,
    sparseUser,
    sparseNote,
    sparseRestoredNote,
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