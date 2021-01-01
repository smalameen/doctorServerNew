const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lzzf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5001;

app.get('/', (req, res) =>{
    res.send("Hello I am form DB");
    
});


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
});

app.post ('/appointmentsByDate' ,  (req, res) => {
    const date = req.body;
    console.log(date.date);
    dataCollection.find({date: date.date})
    .toArray((error, document) => {
        res.send(document);
    })
    
});

app.post ('/addDoctor' ,  (req, res) => {
    const files = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    console.log(files, name, email);
    files.mv(`${__dirname}/doctors/${files.name}`, error => {
    if(error){
    console.log(error);
    return res.status(5001).send({meg:"Failed to load image"})
}
    })
    return res.send({name: files.name, path:`/${files.name}`})
});
});

app.listen(process.env.PORT || port)