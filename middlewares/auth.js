const {authenticate} = require("../lib/authentication");
const {UnAuthorized} = require("../lib/exception");
const {ResponseCode} = require("../util/responseCode")

module.exports = {
    before: async (request) =>{
      try{
        const { Authorization,app_key } = request.event?.headers;
        if(Authorization) {
            const [token, ...rest] = Authorization.split(" ").reverse();
            const decodeData = await authenticate(token,app_key);
            request.event.user = decodeData;
            return request.response;
        } else { UnAuthorized(); }
      }catch(error){
        request.error = error;
        return request.response;
      }
    },
    onError: async (request) =>{
      request.error = ResponseCode.UN_AUTHORIZED;
      return request.response;
    }
}
