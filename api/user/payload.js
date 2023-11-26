const create = (userId,username) =>{
    return {
        userId:userId,
        username:username,
    }
}

const checksOut = (payload) =>{
    return  payload["userId"] && 
            payload["username"]; 
}

const compare = (p1,p2) =>{
    if(checksOut(p1) && checksOut(p2)){
        return  (p1.userId === p2.userId && 
                p1.username === p2.username)
    }
    return false;
}

module.exports = {
    create,
    compare,
    checksOut
}