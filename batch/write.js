//const data = [];
// data.push(putRequestItem({id:""}))
//let params = {RequestItems: {[process.env.DYNAMO_DB_TABLE]: data},}
//await documentClient.batchWrite(params).promise();

const requestItems = (tableName,data) =>{
    return { RequestItems: { [tableName]: data} }
}

const putRequestItem = (data) =>{
    return {
        PutRequest: {
            Item: data,
          }
    }
}

const deleteRequestItem = (data) =>{
    return {
        DeleteRequest: {
            Item: data,
          }
    }
}

module.exports = {
    requestItems,
    putRequestItem,
    deleteRequestItem
}