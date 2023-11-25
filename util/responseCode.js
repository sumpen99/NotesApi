const ResponseCode = Object.freeze({
    OK:{code:200,message:"OK"},
    NO_USER_FOUND:{code:204,message:"There is no user record present for the request!"},
    BAD_REQUEST:{code:400,message:""},
    UN_AUTHORIZED:{code:401,message:"You are not authorized to access the resource!"},
    NOT_FOUND:{code:404,message:""},
    TOKEN_EXPIRED:{code:498,message:"You are not authorized to access the resource!"},
    INTERNAL_SERVER_ERROR:{code:500,message:""},
});

module.exports = {
    ResponseCode
}