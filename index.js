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

async function run() {
   try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const database = client.db("BloodDonor");
      const bloodCollection = database.collection("BloodInfo");

      // Define your routes here, after the client is connected
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
         try {
            const result = await bloodCollection.insertOne(donateData);
            res.send(result);
         } catch (error) {
            console.error("Error on BloodCollection || ", error);
            res.status(500).send("Error saving donation data");
         }
      });

   } catch (error) {
      console.error("Failed to connect to the database:", error);
   }

   // Start the server after routes are defined
   app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
   });

   // Do not close the client immediately
   // await client.close(); // Remove this line or handle it in a shutdown hook
}

run().catch(console.error);
