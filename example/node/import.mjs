import XAPI from "../../dist/XAPI.cjs";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.LRS_ENDPOINT || "";
const username = process.env.LRS_USERNAME || "";
const password = process.env.LRS_PASSWORD || "";
const auth = XAPI.toBasicAuth(username, password);
const xapi = new XAPI(endpoint, auth);

xapi.getAbout().then((result) => {
  console.log(result.data);
});
