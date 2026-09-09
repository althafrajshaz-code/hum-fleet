const { MongoClient } = require('mongodb');

const uri = "mongodb://althafrajshaz_db_user:admin123@ac-dwijw1m-shard-00-00.scz9vvx.mongodb.net:27017,ac-dwijw1m-shard-00-01.scz9vvx.mongodb.net:27017,ac-dwijw1m-shard-00-02.scz9vvx.mongodb.net:27017/?ssl=true&replicaSet=atlas-wpk0st-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});

async function run() {
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully to server");
    
    // Attempt a simple query to verify auth
    const db = client.db('admin');
    const result = await db.command({ ping: 1 });
    console.log("Ping result:", result);
  } catch (err) {
    console.error("Connection failed!");
    console.error(err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
