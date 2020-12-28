const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5001;

app.get('/', (req, res) =>{
    res.send("Hello I am form DB");
    
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lzzf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db("doctorAppointment").collection("receiveAppo");

  app.post ('/userAppointment' ,  (req, res) => {
    const userAppo = req.body;
    console.log(userAppo);
    dataCollection.insertOne(userAppo)
    .then(result => {
        res.send(result.insertedCount > 0)
    }) 
})
});

app.listen(process.env.PORT || port)