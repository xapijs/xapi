import XAPI from "../../dist/XAPI.cjs";
import dotenv from "dotenv";

dotenv.config();

const credentials = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY)[0];
const endpoint = credentials.endpoint;
const username = credentials.username;
const password = credentials.password;
const auth = XAPI.toBasicAuth(username, password);
const xapi = new XAPI({
  endpoint: endpoint,
  auth: auth
});

xapi.getAbout().then((result) => {
  console.log(result.data);
});
