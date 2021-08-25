const registerService = require ('./service/register');
const loginService = require ('./service/login');
const verifyService = require ('./service/verify');
const util = require('./utils/util'); //add .util before buildResponse

const healthPath ='/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
  console.log('Request Event:', event);
  let response;
  switch(true){
      case event.httpMethod === 'GET' && event.path === healthPath:
          response = util.buildResponse(200);
          break;
      case event.httpMethod === 'POST' && event.path === registerPath: // REGISTER
          // extract the request body from the event
          const registerBody = JSON.parse(event.body);
        //   response = buildResponse(200);
        //use the register service to register the new user
        response = await registerService.register(registerBody);
        //since it is using dynamo use await = async function
        //define the response = await registerService.register(registerBody); in the register file
          break;
      case event.httpMethod === 'POST' && event.path === loginPath: //LOGIN
        //extract request body
        const loginBody =JSON.parse(event.body);
        response = loginService.login(loginBody); //define this function inside login.js

        //   response = util.buildResponse(200);
          break;
      case event.httpMethod === 'POST' && event.path === verifyPath: //VERIFY
          //extract the verify body

          const verifyBody =JSON.parse(event.body);
          //use the verify service
          response = verifyService.verify(verifyBody); //verify the token if it is expired or still valid
          //define this function inside VERIFY.js
        //   response = util.buildResponse(200);
          break;
          
    default:
        response = util.buildResponse(404, '404 Not Found');
  }
  return response;
};

