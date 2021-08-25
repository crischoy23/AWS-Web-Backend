function buildResponse(statusCode, body){
    return{
        statusCode: statusCode, 
        headers: {
            'Access-Control-Allow-Origin': '*',
            //allows users to access API of lambda
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
        //stringify version of the body object because that is what API 
        //gateway is expecting
    }
}

module.exports.buildResponse = buildResponse;