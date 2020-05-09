import Axios from 'axios';


var instance = undefined;
//https://firebase.google.com/docs/database/rest/auth
var {google} = require("googleapis");

// Load the service account key JSON file.
var serviceAccount = require("./serviceAccount/unanimity-8d56c-firebase-adminsdk-ga5tr-4b97455e48.json");

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

var accessToken = null;
// Use the JWT client to generate an access token.

jwtClient.authorize(  function(error, tokens) {
  if (error) {
    console.log("Error making request to generate access token:", error);
  } else if (tokens.access_token === null) {
    console.log("Provided service account does not have permission to generate access tokens");
  } else {
    accessToken = tokens.access_token;

  }
});


  //access token is still undefined at this current time because it takes time. 
   instance = Axios.create ( {
  
        baseURL: 'https://unanimity-8d56c.firebaseio.com/', 
        headers: { 'Authorization': accessToken}
       
    } );



  export default instance;


