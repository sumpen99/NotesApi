const userParams = (username) =>{
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        Key: {PK : `USER#${username}`,SK:`USER#${username}`}};
}

module.exports = {
    userParams
}