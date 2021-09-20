import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
//const dataBase_location = process.env.LOCAL ? 'postgres://academy@localhost/project1': 'postgres://ygirkboumscmxk:67d112e9450aaf31271979082c22f1a72fd39b3e0bdcb276c73519e94464658a@ec2-3-220-214-162.compute-1.amazonaws.com:5432/ddi3gefpv87jat'
const dbConfig = {
  //connectionString: dataBase_location,
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
  // ssl: 'postgres://ygirkboumscmxk:67d112e9450aaf31271979082c22f1a72fd39b3e0bdcb276c73519e94464658a@ec2-3-220-214-162.compute-1.amazonaws.com:5432/ddi3gefpv87jat'
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query('select * from info');
  res.json(dbres.rows);
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
