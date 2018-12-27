'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');



const app = require('../server');


chai.use(chaiHttp);

describe('Reality check', function(){
    
  it('true should be true', function(){
    expect(true).to.be.true;
  });

  it('2+2 should equal 4', function(){
    expect(2+2).to.equal(4);
  });
});


describe('Express static', function(){



  it('GET request "/" should return the index page', function() {
    return chai
      .request(app)
      .get('/')
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;

      });
  });

  it('GET notes should return an array of 10 notes as an array', function(){
    return chai
      .request(app)
      .get('/api/notes/')
      .then(res => {
        console.log(res.body);
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
      
        expect(res.body.length).to.be.at.least(10);

        const expectedKeys= ['id', 'title','content'];
        res.body.forEach(item =>{
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('GET request by id should get the note with specified ID', function(){
    const id = 1005;
    return chai
      .request(app)
      .get(`/api/notes/${id}`)
      .then(res =>{
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
      });
  });

  it('should add a note on POST', function(){
    const newItem = {
      id: 9000,
      title: 'Some new title',
      content: 'With some new content'
    };
    return chai
      .request(app)
      .post('/api/notes')
      .send(newItem)
      .then(res =>{
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title','content');
        expect(res.body.id).to.not.equal(null);

        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        );
      });
  });

  it('Should return newly modified item with PUT or 404 for valid id', function(){
    const updateData = {
      id: 1005,
      title: 'some new content',
      content: 'and then some new content'
    };
    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(res =>{
          updateData.id = res.body[0].id;

          return chai
            .request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);

        })
        .then(res=>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(updateData);
        })
    );
  });

  it('should remove recipe on delete', function(){
    return(
      chai
        .request(app)
        .get('/api/notes')
        .then(res =>{
          return chai
            .request(app)
            .delete(`/api/notes/${res.body[0].id}`);
        })
        .then(res =>{
          expect(res).to.have.status(204);
        })
    );
  });
});


describe('404 handler', function () {
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });


});