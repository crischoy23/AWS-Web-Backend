const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})

const util = require('../utils/util')
const dynamodb = new AWS.DynamoDB.DocumentClient(); //define dynamodb client
const userTable = ''; //define userTable
const bcrypt = require('bcryptjs'); //encrypt password
const auth = require('../utils/auth');

async function login(user){
    const username = user.username; //extract from user input
    const password = user.password;

    if (!user || !username || !password){ //if user or username or password ins not defined return 401 that says
        return util.buildResponse(401, {
            message: 'username and password are required'
    })
    }

    //LOGIC
    const dynamoUser = await getUser(username.toLowerCase().trim()); //get username from API

    //if there is no dynamoUser or dynamoUser does not have a username return 403 response with message 'user does not exist
    if (!dynamoUser || !dynamoUser.username){
        return util.buildResponse(403, {message: 'user does not exist'});
    }

    //if the user exist, check the password and check if it matches the one that is in the database

    if(!bcrypt.compareSync(password, dynamoUser.password)){ //if they don't match, return 403 with message 'password is incorrect
        return util.buildResponse(403, {message: 'password is incorrect'});
    }

    //if everything matches, define a user info object and return that to user along with the access token
    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }
    //create a token for the user > see auth.js

    const token = auth.generateToken(userInfo)

    //define the response Body

    const response = {
        user: userToken,
        token: token
    }
    return util.buildResponse(200, response);

    //define the getUser function
    async function getUser(username){
        const params = {
            TableName: userTable,
            Key: {
                username: username
            }
        }
    
        return await dynamodb.getUser(params).promise().then(response => {
            return response.Item;
        }, error => {
            console.error('There is an error getting user: ', error);
        })
    }

}
module.exports.register = register;