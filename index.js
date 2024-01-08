const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5jjbyfi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const allWorkingTime = client.db("time").collection("allWork");

async function run() {
  try {
    app.get("/", (req, res) => {
      res.send("Everything Ok");
    });

    app.post("/workingTimePost", async (req, res) => {
      const data = req.body;
      const result = await allWorkingTime.insertOne(data);
      res.send(result);
    });

    app.get("/getWorkingTime", async (req, res) => {
      const { userEmail } = req.query;
      const query = { userEmail: userEmail };
      const result = await allWorkingTime.find(query).toArray();
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
}
run();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
