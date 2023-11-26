const userParams = (username) =>{
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        Key: {PK : `USER#${username}`,SK:`ACCOUNT#${username}`}};
}

module.exports = {
    userParams
}

/*
const userParams = (username) =>{
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        KeyConditionExpression: "#pk= :pk And begins_with(#sk, :sk)",
        ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK"
        },
        ExpressionAttributeValues: {
            ":pk": `USER#${username}`,
            ":sk": `ACCOUNT#${username}`
        }
    }
}

*/