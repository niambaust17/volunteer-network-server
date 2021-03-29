const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.o1cg3.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) =>
{
    res.send('server connected')
})

client.connect(err =>
{
    const eventCollection = client.db("volunteernetworkdb").collection("events");

    app.post('/addEvent', (req, res) =>
    {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
            .then(result =>
            {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/events', (req, res) =>
    {
        const query = req.query;
        eventCollection.find(query)

            .toArray((error, data) =>
            {
                res.send(data);
            })
    })

    app.delete('/event/:id', (req, res) =>
    {
        const id = ObjectID(req.params.id);
        eventCollection.findOneAndDelete({ _id: id })
            .then(result =>
            {
                res.json({ success: !!data.value })
            })
            .then(error =>
            {
                console.log(error);
            })
    })
});

app.listen(port)