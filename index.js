
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors =require('cors');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;


// middlewire



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asap9hb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    client.connect();    

     
//   automobile
// services
   
    //  mongodb colletion
    const serviceCollection =client.db('automobile').collection('services');

    const bookingCollection =client.db('automobile').collection('bookings');

    // data read api
    app.get('/services',async(req,res)=>{

        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // dynamic service data load api
    
    app.get('/services/:id',async(req,res)=>{

        const id = req.params.id;
        const query ={ _id: new ObjectId(id)}
        
        const options = {
          
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1, service_id: 1, img: 1,},
          };


        const result =await serviceCollection.findOne(query, options);
         res.send(result);
    })

    //  post booking api 

     app.post('/bookings',async(req,res)=>{
        const booking =req.body;
        console.log(booking)

        const result =await bookingCollection.insertOne(booking);
        res.send(result);

        
     })


    //  query email and specific data

     app.get('/bookings',async (req,res)=>{

      console.log(req.query.email);
      let query ={};
       if(req.query?.email){
        query ={email: req.query.email}
       }
      const result = await bookingCollection.find().toArray();
      res.send(result);

     })

    //  detete 

     app.delete('/bookings/:id',async(req,res)=>{
         const id =req.params.id;
         console.log(id);

         const query ={_id: new ObjectId(id)}
         const result =await bookingCollection.deleteOne(query);
         res.send(result);
     })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('automoblile sevice project is running');
})

app.listen(port,()=>{
    console.log(`automoblile sevice project is running on port,${port}`)
})