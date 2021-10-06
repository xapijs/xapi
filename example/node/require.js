const XAPI = require("../../dist/XAPI.cjs.js");

require("dotenv").config();

const credentials = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY)[0];
const endpoint = credentials.endpoint;
const username = credentials.username;
const password = credentials.password;
const auth = XAPI.toBasicAuth(username, password);
const xapi = new XAPI(endpoint, auth);

xapi.getAbout().then((result) => {
  console.log(result.data);
});
