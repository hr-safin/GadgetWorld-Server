const express = require("express")
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require("cors")

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjgmiey.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("productDB");
    const productCollection = database.collection("product");

    const database2 = client.db("cartDB");
    const cartCollection = database.collection("cart");



    // create product

    app.post("/addProduct", async(req,res) => {
      const product = req.body
      const result = await productCollection.insertOne(product)
      res.send(result)
      console.log(result)
    })

    app.post("/myCart", async(req, res) => {
      const cart = req.body
      const result = await cartCollection.insertOne(cart)
      res.send(result)
      console.log(result)
    })


    // get

    app.get("/brand", async(req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/myCart", async(req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // for update
    app.get("/update/:id", async(req, res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // put

    app.put("/update/:id", async(req,res) => {
      const id = req.params.id
      const product = req.body
      const filter = {_id : new ObjectId(id)}
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name : product.name,
          brandName : product.brandName,
          type : product.type,
          price : product.price,
          description : product.description,
          rating : product.rating,
          photo : product.photo
          
        },
      };
      const result = await productCollection.updateOne(filter, updateProduct, options);
      res.send(result)
    })

    app.get("/details/:id", async(req, res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // delete

    app.delete("/myCart/:id", async(req, res) => {
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(filter)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running successfully")
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})