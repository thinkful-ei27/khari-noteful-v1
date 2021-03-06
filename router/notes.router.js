'use strict';

const express = require('express');

const router = express.Router();
//const {NotesRouter} = require('./data');
const data = require('../db/notes');

// Simple In-Memory Database
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

router.get('/', (req, res, next)=>{
  const {searchTerm} = req.query;
  
  notes.filter(searchTerm)
    .then(list =>{
      if(list){
        return res.json(list);
      } else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  
  /*
  notes.filter(searchTerm, (err, list)=>{
    if(err){
      return next(err);  //goes to error handler
    }
    res.json(list);       //responds with filtered array
  });
  */
});

router.get('/:id', (req, res, next)=>{
  const id = req.params.id;
  /*
  notes.find(Number(id), (err, item)=>{
    if(err){
      return next(err);
    }
    res.json(item);
  });
  */
  notes.find(Number(id))
    .then(item =>{
      if(item){
        return res.json(item);
      } else{
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

router.put('/:id', (req, res, next)=>{
  const id = req.params.id;

  const updateObj ={};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });
  /*
  notes.update(id, updateObj, (err, item)=>{
    if(err){
      return next(err);
    }
    if(item){
      res.json(item);
    } else{
      next();
    }
  });
  */

  notes.update(id, updateObj)
    .then(item =>{
      if(item){
        return res.json(item);
      } else{
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

router.post('/',(req, res, next)=>{
  const {title, content} = req.body;

  const newItem = {title, content};
  /****Never trust a user****/
  if(!newItem.title){
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  /*
  notes.create(newItem, (err, item)=> {
    if(err){
      return next(err);
    }
    if(item){
      res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
  */

  notes.create(newItem)
    .then(item =>{
      if(item){
        res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
      } else{
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

router.delete('/:id', (req, res, next)=>{
  const id = req.params.id;
  
  /*
  notes.delete(id,(err)=>{
    if(err){
      return next(err);
    }
    else{
      res.sendStatus(204);
    }
  });
*/
  notes.delete(id)
    .then(item =>{
      if(item){
        res.sendStatus(204);
      }else {
        next();
      }
    })
    .catch(err =>{
      next(err);
    });
});

module.exports = router;