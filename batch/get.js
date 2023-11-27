//const requestGetItems = requestItems(DYNAMO_TABLE_NAME,roomIds)
//data = (await SERVER.documentClient.batchGet(requestGetItems).promise()).Responses[DYNAMO_TABLE_NAME];
const requestItems = (tableName,ids) =>{
    return {
        RequestItems: {
            [tableName]: {
              Keys: ids.map(id => ({["PK"]: `${id}`}))
            }
        }
    }
}

module.exports = {
    requestItems,
}