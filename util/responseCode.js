const ResponseCode = Object.freeze({
    OK:{data:{code:200,message:"OK"}},
    NO_USER_FOUND:{data:{code:204,message:"There is no user record present for the request!"}},
    BAD_REQUEST:{data:{code:400,message:""}},
    UN_AUTHORIZED:{data:{code:401,message:"You are not authorized to access the resource!"}},
    NOT_FOUND:{data:{code:404,message:"NoteId is not present in request."}},
    TOKEN_EXPIRED:{data:{code:498,message:"You are not authorized to access the resource!"}},
    INTERNAL_SERVER_ERROR:{data:{code:500,message:""}},
});

module.exports = {
    ResponseCode
}