'use strict';

// Load array of notes

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const data = require('./db/notes');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  console.log(data);
  if (searchTerm !== ''){
    const result = data.filter(item => {if(
      item.title.includes(searchTerm) || item.content.includes(searchTerm)) 
    {return item;}
    });

    console.log(result);
    res.json(result);}
  else res.json(data);
});



//revisit at the end of the day
app.get('/api/notes/:id', (req, res)=>{
  const id = req.params.id;
  //console.log('fishing');
  let result = data.find(item =>{
    return item.id === Number(id);
  });
  res.json(result);
});

