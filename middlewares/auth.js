const {authenticate} = require("../lib/authentication");
const {UnAuthorized} = require("../lib/exception");
const {ResponseCode} = require("../util/responseCode")

module.exports = {
    before: async (request) =>{
      try{
        const { authorization } = request.event.headers;
        if(authorization) {
            const [token, ...rest] = authorization.split(" ").reverse();
            await authenticate(token)
            .then((decodeData) =>{
              request.event.user = decodeData;
              return request.response;
            })
            .catch((error) =>{
              throw error;
            })
      } else { UnAuthorized(); }
      }catch(error){
        request.event.error = error;
        return request.response;
      }
    },
    onError: async (request) =>{
      request.event.error = ResponseCode.UN_AUTHORIZED;
      return request.response;
    }
}
