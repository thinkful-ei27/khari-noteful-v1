'use strict';

// Load array of notes

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const data = require('./db/notes');

const {PORT} = require('./config');
const {handleLogger} = require('./middleware/logger.js');
const app = express();



// ADD STATIC SERVER HERE
app.use(express.static('public'));
app.use(handleLogger);



app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  console.log(searchTerm);
  if (searchTerm)
  {
    const result = data.filter(item => {
      return item.title.includes(searchTerm);
    });
    //console.log(result);
    res.json(result);
  }
  else res.json(data);
});

app.get('/api/notes/:id', (req, res)=>{
  const id = req.params.id;
  //console.log('fishing');
  let result = data.find(item =>{
    return item.id === Number(id);
  });
  res.json(result);
});

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


app.listen(PORT, function () {
  console.info(`Server listening on ${PORT}`);
}).on('error', err => {
  console.error(err);
});