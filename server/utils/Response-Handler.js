exports.success_function = function success_function(api_Data){
    let res = {
        success : true,
        statusCode : 200,
        message : api_Data.message ? api_Data.message : null,
        data : api_Data.data ? api_Data.data : null,
    }
    return res;
}

exports.error_function = function error_function(api_Data){
    let res = {
        success : false,
        statusCode : 400,
        message : api_Data.message ? api_Data.message : null,
        data : api_Data.data ? api_Data.data : null,
    }
    return res;
}