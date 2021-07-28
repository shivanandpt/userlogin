
var createErrorResonse = function (status, msg) {

    let err = new Error(msg);
    err.status = status || 500;
    return err;
};

var createSuccessResponse = function ({ data, msg }) {
    
    return {
        success: true,
        data,
        message: msg
    };
};

module.exports = {
    createErrorResonse: createErrorResonse,
    createSuccessResponse: createSuccessResponse
}