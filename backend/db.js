const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://127.0.0.1:27017")

async function connectDB() {
  await client.connect()
  console.log("MongoDB Connected")
  return client.db("pharmacyDB")
}

module.exports = connectDB