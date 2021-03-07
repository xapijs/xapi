import XAPI from "../../dist/XAPI.cjs";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.LRS_ENDPOINT || "";
const username = process.env.LRS_USERNAME || "";
const password = process.env.LRS_PASSWORD || "";
const auth = `Basic ${Buffer.from(username + ":" + password, "binary").toString("base64")}`;
const xapi = new XAPI(endpoint, auth);

xapi.getAbout().then((result) => {
  console.log(result.data);
});
