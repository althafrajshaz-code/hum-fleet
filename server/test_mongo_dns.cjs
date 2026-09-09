const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { MongoClient } = require('mongodb');

// Use the original SRV URI
const uri = "mongodb+srv://althafrajshaz_db_user:admin123@cluster0.scz9vvx.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});

async function run() {
  try {
    console.log("Connecting with SRV via Google DNS...");
    await client.connect();
    console.log("Connected successfully to server");
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
