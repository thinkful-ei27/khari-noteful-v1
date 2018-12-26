'use strict';

// Load array of notes

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const data = require('./db/notes');

// Simple In-Memory Database
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

const {PORT} = require('./config');
const morgan = require('morgan');
const notesRouter = require('./routes/notes.router');
const app = express();


// ADD STATIC SERVER HERE
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/notes', notesRouter);


app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

/*
app.startServer = function (port) {
  return new Promise((resolve, reject) => {
    this.listen(port, function () {
      this.stopServer = require('util').promisify(this.close);
      resolve(this);
    }).on('error', reject);
  });
};
*/




if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing