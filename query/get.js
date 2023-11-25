const userParams = (userid) =>{
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        Key: {PK : `USER#${userid}`,SK:`USER#${userid}`}};
}

module.exports = {
    userParams
}