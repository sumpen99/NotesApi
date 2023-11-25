module.exports = {
    APP_KEY:"MY_SUPER_SECRET_APP_KEY"
}

// OPTION 1 -> USE KMS KEY
//https://www.oclc.org/developer/news/2019/serverless-application-credentials.en.html

// OR OPTION 2 -> AWS.SSM
// https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html
/*

'use strict';

const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

const parameterStore = new AWS.SSM()

const getParam = param => {
  return new Promise((res, rej) => {
    parameterStore.getParameter({
      Name: param
    }, (err, data) => {
        if (err) {
          return rej(err)
        }
        return res(data)
    })
  })
}

module.exports.get = async (event, context) => {
  const param = await getParam('MyTestParameter')
  console.log(param);
  return {
    statusCode: 200,
    body: JSON.stringify(param)
  };
};

*/