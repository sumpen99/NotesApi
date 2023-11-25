const { reject, resolve } = require("bluebird");
const JWT = require("jsonwebtoken");
const { UnAuthorized } = require("./exception");
const {ResponseCode} = require("../util/responseCode")
const response = require("../util/response");

const generateToken = (payload, secret) => {
  let token = JWT.sign(payload, secret);
  return token;
};

const refreshToken = (token) => {
  try {
    if(!token){ UnAuthorized(); }
    let decodedToken, newToken;
    decodedToken = JWT.verify(token, process.env.APP_KEY);
    newToken = JWT.sign({ id: decodedToken.id }, process.env.APP_KEY, { expiresIn: "1h" });
    return { token: newToken, tokenExpiration: "1h" };
  } catch (error) {
    if(error.name == "TokenExpiredError") {
      const payload = JWT.verify(token, process.env.APP_KEY, { ignoreExpiration: true });
      newToken = JWT.sign({ id: payload.id }, process.env.APP_KEY, { expiresIn: "1h" });
      return { token: newToken, tokenExpiration: "1h" };
    } else { throw error; }
  }
};

const refreshAccessToken = async (event) => {
  try {
    const {APP_KEY, Authorization } = event?.headers;
    if (process.env.APP_KEY === APP_KEY) {
      const token = refreshToken(Authorization);
      return response.create(200, { token:token });
    } 
    else { UnAuthorized() }
  } catch (error) {
    return response.create(400, { message:error });
  }
};

const authenticate = (token, APP_KEY) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, APP_KEY, (err, decoded) => {
      if(err) { reject(ResponseCode.UN_AUTHORIZED); } 
      else { resolve(decoded); }
    });
  });
};

module.exports = {
  authenticate,
  generateToken,
  refreshAccessToken
};