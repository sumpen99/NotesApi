const create = (userId,username,firstname,lastname) =>{
    return {
        userId:userId,
        username:username,
        firstname:firstname,
        lastname:lastname
    }
}

const checksOut = (payload) =>{
    return  payload["userId"] && 
            payload["username"] && 
            payload["firstname"] && 
            payload["lastname"]; 
}

const compare = (p1,p2) =>{
    if(checksOut(p1) && checksOut(p2)){
        return  (p1.userId === p2.userId && 
                p1.username === p2.username &&
                p1.firstname === p2.firstname && 
                p1.lastname === p2.lastname)
    }
    return false;
}

module.exports = {
    create,
    compare,
    checksOut
}