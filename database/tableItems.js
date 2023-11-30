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

const createDeletedNote = (username,note) =>{
    const {upperCasedUsername,createdAt} = baseItemPropertie(username);
    return {
        PK:`USER#${upperCasedUsername}`,
        SK:`NOTE#DELETED#${note.id}`,
        id:note.id,
        title:note.title,
        text:note.text,
        createdAt:note.createdAt,
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
        modifiedAt:createdAt
    }
}

const sparsInitialNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt
    }
}

const sparseModifiedNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt,
        modifiedAt:note.modifiedAt
    }
}

const sparseDeletedNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt,
        deletedAt:note.deletedAt
    }
}

const sparseRestoredNote = (note) =>{
    return {
        id:note.id,
        createdAt:note.createdAt,
        restoredAt:note.modifiedAt
    }
}

module.exports = {
    createUser,
    createInitialNote,
    createDeletedNote,
    createRestoredNote,
    sparseModifiedNote,
    sparseDeletedNote,
    sparseRestoredNote,
    sparsInitialNote,
    sparseUser,
}
