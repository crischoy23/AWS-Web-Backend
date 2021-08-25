const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})

const util = require('../utils/util')
const dynamodb = new AWS.DynamoDB.DocumentClient(); //define dynamodb client
const userTable = ''; //define userTable
const bcrypt = require('bcryptjs'); //encrypt password

//async takes in userInfo as an input
//user input will have a (name, email, username, password) and extract all that
async function register(userInfo){
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;

    //if any of them is empty or undefined, return 401
    if (!username || !name || !email || !password){
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username);
    //if something returns and it has a username registered already, prompt username already exist
    if (dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message: 'username already exists in our database. Please choose a different username'
        })
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW
    }

    //if the user chooses a unique username, first: encrypt password > use library bcryptjs type above

    //save the object to the database
    const saveUserResponse = await saveUser(user);
    //if we don't get response,
    if (!saveUserResponse){
        return util.buildResponse(503, {message: 'Server Error. Please try again later'});
    }

    //if everything is successful, return 200
    return util.buildResponse(200, { username: username}); //{ username: username}) return username back to the user

    
}

//define the two methods getUser and saveUser
//both async functions

//async function getUser that takes in a username 
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

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error =>{
        console.error('There is an error saving user:', error)
    });
}

module.exports.register = register;