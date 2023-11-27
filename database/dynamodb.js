const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const SERVER = {
    documentClient,
};

module.exports = {
    SERVER
}


