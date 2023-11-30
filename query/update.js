const baseItemPropertie = (username) =>{
    let createdAt = new Date().toISOString();
    return {
        upperCasedUsername:username.toUpperCase(),
        createdAt:createdAt
    }
}

const collectUpdateExpression = (item,createdAt) =>{
    let updateExpression = "";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    item["modifiedAt"] = createdAt;
    Object.entries(item).forEach(([key,value],i) =>{
        if(i === 0){ updateExpression += `set #k${i} = :v${i}` }
        else{ updateExpression += `, #k${i} = :v${i}`}
        expressionAttributeNames[`#k${i}`] = key
        expressionAttributeValues[`:v${i}`] = value
    })
    return {updateExpression,expressionAttributeNames,expressionAttributeValues}
    
}

  
const noteParams = (username,item,noteId) =>{
    const {upperCasedUsername,createdAt} = baseItemPropertie(username);
    const {updateExpression,expressionAttributeNames,expressionAttributeValues} = collectUpdateExpression(item,createdAt);
      return { 
          TableName: process.env.DYNAMO_DB_TABLE, 
          Key: {PK : `USER#${upperCasedUsername}`,SK:`NOTE#ALIVE#${noteId}`},
          UpdateExpression:updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ConditionExpression:"attribute_exists(PK) AND attribute_exists(SK)",
          ReturnValues: 'ALL_NEW',
      }
  }



module.exports = {
    noteParams
}