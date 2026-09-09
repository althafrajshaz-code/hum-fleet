const { Client } = require('ssh2');
const conn = new Client();

const script = `
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://althafrajshaz_db_user:admin123@cluster0.scz9vvx.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
async function run() {
  try {
    await client.connect();
    console.log("Connected!");
  } catch (err) {
    console.error("RAW ERROR: ", err);
  } finally {
    await client.close();
  }
}
run();
`;

conn.on('ready', () => {
  conn.exec(`echo '${script.replace(/'/g, "'\\''")}' > /root/hum-fleet/server/test_mongo.js && cd /root/hum-fleet/server && node test_mongo.js`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
