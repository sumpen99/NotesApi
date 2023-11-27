//let transactItems = [];
//transactItems.push(transactItemBooking(bookingDetails));
//transactItems.push(transactItemRoom(room.id,stringOfDates)); 
//let params = { TransactItems:transactItems }
//await SERVER.documentClient.transactWrite(params).promise();
  

const putItem = (data) =>{
    return{ 
        Put: {
            TableName: process.env.DYNAMO_DB_TABLE,
            Item: data
        }
    }
}


const updateItem = (id,dates) =>{
    return{ 
        Update: {
            TableName: process.env.DYNAMO_DB_TABLE,
            Key: { "id": id },
            UpdateExpression: "SET #dd = list_append(#dd, :dates)",
            ExpressionAttributeNames: { '#dd': 'bookedDates' },
            ExpressionAttributeValues:{ ':dates':dates}
        }
    }
}

module.exports = {
    putItem,
    updateItem
}