const baseItemPropertie = (username) =>{
  return {
      upperCasedUsername:username.toUpperCase(),
  }
}

const userParams = (username) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        Key: {PK : `USER#${upperCasedUsername}`,SK:`ACCOUNT`},
    };
}

const allNotesAlive = (username) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        KeyConditionExpression: "#pk = :pk And begins_with(#sk, :sk)",
        ProjectionExpression: "id, title, #t, createdAt, modifiedAt",
        ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK",
            "#t":"text",
        },
        ExpressionAttributeValues: {
            ":pk": `USER#${upperCasedUsername}`,
            ":sk": `NOTE#ALIVE`
        },
    }
}

const allNotesDeleted = (username) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
    return { 
        TableName: process.env.DYNAMO_DB_TABLE, 
        KeyConditionExpression: "#pk = :pk And begins_with(#sk, :sk)",
        ProjectionExpression: "id, title, #t, createdAt, deletedAt",
        ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK",
            "#t":"text",
        },
        ExpressionAttributeValues: {
            ":pk": `USER#${upperCasedUsername}`,
            ":sk": `NOTE#DELETED`
        },
    }
}

const specificNoteAlive = (username,noteId) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
  return { 
      TableName: process.env.DYNAMO_DB_TABLE, 
      Key: {PK : `USER#${upperCasedUsername}`,SK:`NOTE#ALIVE#${noteId}`},
      ProjectionExpression: "id, title, #t, createdAt, modifiedAt",
      ExpressionAttributeNames: {
        "#t":"text",
    },
  };
}

const specificNoteDeleted = (username,noteId) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
  return { 
      TableName: process.env.DYNAMO_DB_TABLE, 
      Key: {PK : `USER#${upperCasedUsername}`,SK:`NOTE#DELETED#${noteId}`},
      ProjectionExpression: "id, title, #t, createdAt, deletedAt",
      ExpressionAttributeNames: {
        "#t":"text",
    },
  };
}

const specificNoteToMoveToTrash = (username,noteId) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
  return { 
      TableName: process.env.DYNAMO_DB_TABLE, 
      Key: {PK : `USER#${upperCasedUsername}`,SK:`NOTE#ALIVE#${noteId}`},
      ReturnValues: 'ALL_OLD'
  };
}

const specificNoteToRestoreFromTrash = (username,noteId) =>{
  const {upperCasedUsername} = baseItemPropertie(username);
  return { 
      TableName: process.env.DYNAMO_DB_TABLE, 
      Key: {PK : `USER#${upperCasedUsername}`,SK:`NOTE#DELETED#${noteId}`},
      ReturnValues: 'ALL_OLD'
  };
}

module.exports = {
    userParams,
    allNotesAlive,
    allNotesDeleted,
    specificNoteAlive,
    specificNoteDeleted,
    specificNoteToMoveToTrash,
    specificNoteToRestoreFromTrash
}

/*
PAGINATION Ex.1
#########################################################################################################

If lastEvaluatedKey is present, Create new query with lastEvaluatedKey as ExclusiveStartKey.
Keep going until lastEvaluatedKey is absent. 

let items = []
let params = {
    TableName: '',
    Limit: 1000,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': value,
    },
}

async function* fetchData({
    params
  }) {
    let data
    do {
      data = await dynamodb.query(params).promise()
      yield data.Items
      params.ExclusiveStartKey = data.LastEvaluatedKey
    } while (typeof data.LastEvaluatedKey != 'undefined')
  }

for await (const data of fetchData(params)) {
    items = [...items, ...data] -> Spread Syntax
}

##########################################################################################################
PAGINATION Ex.2 AWS-RECOMMENDED
import {
  DynamoDBClient,
  QueryCommandInput,
  QueryCommandOutput,
  paginateQuery,
} from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({ region: "" });

const items: QueryCommandOutput[] = [];

const query: QueryCommandInput = {
  TableName: VIDEOS_TABLE_NAME,
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :videoId",
  ExpressionAttributeValues: {
    ":videoId": { S: "VIDEO#123" },
  },
};

const pager = paginateQuery({ client: dbClient }, query);

for await (const item of pager) {
  items.push(item);
}
https://stackoverflow.com/questions/42765437/pagination-in-dynamodb-using-node-js
*/