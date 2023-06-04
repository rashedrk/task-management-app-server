const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle Ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrkrfrq.mongodb.net/?retryWrites=true&w=majority`;
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
        await client.connect();

        const tasksCollection = client.db('taskManagement').collection('tasks');

        //Create
        //add new task to database
        app.post('/task',async(req,res) => {
            const newTask = req.body;
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        })

        //Read
        //get all available tasks data
        app.get('/tasks', async (req, res) => {
            const cursor = tasksCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //Update
        // update task details 
        app.put('/tasks/:id', async(req,res) => {
            const id = req.params.id;
            const {status} = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = {upsert: true};
            const updateTask = {
                $set: {status: status}
            }
            const result = await tasksCollection.updateOne(filter, updateTask, options);
            res.send(result);
        })

        //Delete
        // delete a single task 
        app.delete('/tasks/:id', async(req,res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result)
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




app.get('/', (req, res) => {
    res.send('Task Management Application server is running')
})

app.listen(port, () => {
    console.log(`Task Management Application server is running on port ${port}`)
})