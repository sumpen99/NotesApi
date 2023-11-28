const { reject, resolve } = require("bluebird");
const JWT = require("jsonwebtoken");
const { UnAuthorized } = require("./exception");
const {ResponseCode} = require("../util/responseCode")
const response = require("../util/response");
const Payload = require("../api/user/payload");

const generateToken = (payload, secret) => {
  return JWT.sign(payload, secret,{ expiresIn: "1h" });
};

const refreshToken = (token) => {
  try {
    if(!token){ UnAuthorized(); }
    let decodedToken, newToken,updatedToken;
    decodedToken = JWT.verify(token, process.env.APP_KEY);
    updatedToken = Payload.create(decodedToken.userId,decodedToken.username);
    newToken = generateToken(updatedToken, process.env.APP_KEY);
    return { token: newToken, tokenExpiration: "1h" };
  } catch (error) {
    if(error.name == "TokenExpiredError") {
      let decodedToken, newToken,updatedToken;
      decodedToken = JWT.verify(token, process.env.APP_KEY, { ignoreExpiration: true });
      updatedToken = Payload.create(decodedToken.userId,decodedToken.username);
      newToken = generateToken(updatedToken, process.env.APP_KEY);
      return { token: newToken, tokenExpiration: "1h" };
    } else { throw error; }
  }
};

const refreshAccessToken = async (event) => {
  try {
    const {authorization,app_key } = event.headers;
    if (app_key === process.env.APP_KEY) {
      const token = refreshToken(authorization);
      return response.create(200, { token:token });
    } 
    else { UnAuthorized() }
  } catch (error) {
    return response.create(400, { message:error.message });
  }
};

const authenticate = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.APP_KEY, (err, decoded) => {
      if(err) { reject(ResponseCode.UN_AUTHORIZED); } 
      else { resolve(decoded); }
    });
  });
};


// OPTION 1 -> USE KMS KEY
//https://www.oclc.org/developer/news/2019/serverless-application-credentials.en.html

// OR OPTION 2 -> AWS.SSM
// https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html
const verifyAppKey = (event) =>{
  return event.headers["app_key"] === process.env.APP_KEY;
}

module.exports = {
  authenticate,
  generateToken,
  refreshAccessToken,
  verifyAppKey
};
