const { MongoClient } = require('mongodb');

// explicit replica set URI + explicitly setting the TLS Server Name to fix SNI routing on Atlas Free Tier
const uri = "mongodb://althafrajshaz_db_user:admin123@ac-dwijw1m-shard-00-00.scz9vvx.mongodb.net:27017,ac-dwijw1m-shard-00-01.scz9vvx.mongodb.net:27017,ac-dwijw1m-shard-00-02.scz9vvx.mongodb.net:27017/?ssl=true&replicaSet=atlas-wpk0st-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0&tlsServerName=cluster0.scz9vvx.mongodb.net";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000
});

async function run() {
  try {
    console.log("Connecting with explicit tlsServerName...");
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db('admin');
    const result = await db.command({ ping: 1 });
    console.log("Ping result:", result);
  } catch (err) {
    console.error("Connection failed!");
    console.error(err.message);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
