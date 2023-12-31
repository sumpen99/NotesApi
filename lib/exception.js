const {CustomError} = require("../util/customError")
const {ResponseCode} = require("../util/responseCode")

const UnAuthorized = () => {
    throw new CustomError('UnAuthorized', ResponseCode.UN_AUTHORIZED.data)
}
const TokenExpired = () => {
    throw new CustomError('UnAuthorized', ResponseCode.TOKEN_EXPIRED.data)
}
const NoUserFound = () => {
    throw new CustomError('No User Found', ResponseCode.NO_USER_FOUND.data)
}

module.exports = {
    UnAuthorized,
    NoUserFound,
    TokenExpired,
}