//use the JSON library web token to create a token 
const jwt = require('jsonwebtoken');

function generateToken(userInfo) {
    if(!userInfo){ //if user is not defined, return null
        return null;
    }

    // const userInfo = {
    //     username: user.username,
    //     email: user.email //gonna use email for hashing but you can use other attributes if you want
    // };

    //gonna pass on a secret for the token > gonna use an environment variable in lambda function that will be used that will be defined later
    return jwt.sign(userInfo, process.env.TOKEN, {
        expiresIn: '1h'
    })

}

function verifyToken(username, token){
    return jwt.verify(token, process.env.TOKEN, (error, response) => {
        if (error) {
            return{
                verified: false,
                message: 'invalid token'
            }
        }

        if (response.username !== username) {
            return{
                verified: false,
                message: 'invalid user'
            }
        }

        return{
            verified: true,
            message: 'verified'
        }
    })
}

module.exports.generateToken = generateToken; //import to login.js
module.exports.verifyToken = verifyToken; //import to verify.js