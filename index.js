const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://daanRaktoAdmin:LmjCCCZJ0nJN7ELo@daanraktocluster.c01e5.mongodb.net/?retryWrites=true&w=majority&appName=daanraktoCluster";
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

const database = client.db("BloodDonor");
const bloodCollection = database.collection("BloodInfo");

app.get("/", (req, res) => {
   res.send("Server is running");
});

app.get("/donate", async (req, res) => {
   try {
      const donate = await bloodCollection.find({}).toArray();
      res.send(donate);
   } catch (error) {
      console.error("Error on donate route page || ", error);
      res.status(500).send("Error fetching donation data");
   }
});

app.post('/donate', async (req, res) => {
   const donateData = req.body;
   // Validate and sanitize donateData here
   try {
      const result = await bloodCollection.insertOne(donateData);
      res.send(result);
   } catch (error) {
      console.error("Error on BloodCollection || ", error);
      res.status(500).send("Error saving donation data");
   }
});

async function run() {
   try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } catch (error) {
      console.error("Failed to connect to the database:", error);
   }
}

run().catch(console.error);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
