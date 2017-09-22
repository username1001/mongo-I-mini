const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const server = express();

const BearSchema = require('./models.js');
// allow server to parse JSON bodies from POST/PUT/DELETE requests
server.use(bodyParser.json());

// TODO: write your server code here
server.get('/bears', (req, res) => {
  BearSchema.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

server.get('/bears/:id', (req, res) => {
  const { id } = req.params;
  BearSchema.findById(id, (err, bear) => {
    if (err) throw err;
    res.json(bear);
  });
});

server.post('/bears', (req, res) => {
  const { species, latinName } = req.body;
  if (!species || !latinName) {
    res.status(422);
    res.json({ error: 'Missing species or latin name.' });
    return;
  }
  const bear = new BearSchema({ species, latinName });
  bear.save((err) => {
    if (err) throw err;
    res.json(bear);
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/bears',
  { useMongoClient: true }
);

/* eslint no-console: 0 */
connect.then(() => {
  const port = 3000;
  server.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
