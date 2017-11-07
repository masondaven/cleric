const RestRepository = require('../src/RestRepository');
const request = require('request');
const expect = require('chai').expect;

describe('Rest Repository', () => {

  @RestRepository({
    model: 'cleric'
  })
  class MyRepository {

  }

  let repo;
  before(() => {
    repo = new MyRepository();
    repo.start();
  });

  after(() => {
    repo.stop();
  });

  it('Should POST model', (done) => {
    request.post('http://localhost:3000/cleric', {
      body: {
        name: 'test'
      },
      json: true
    }, (error, response, body) => {
      expect(body).to.deep.equal({
        id: 1,
        name: 'test'
      });
      done();
    });
  });

  it('Should GET model', (done) => {
    request.get('http://localhost:3000/cleric/1', { json: true }, (error, response, body) => {
      expect(body).to.deep.equal({
        id: 1,
        name: 'test'
      });
      done();
    });
  });

  it('Should UPDATE model', (done) => {
    request.put('http://localhost:3000/cleric/1', {
      body: {
        name: 'test1'
      },
      json: true
    }, (error, response, body) => {
      expect(body).to.deep.equal({
        id: 1,
        name: 'test1'
      });
      done();
    });
  });

  it('Should DELETE model', (done) => {
    request.delete('http://localhost:3000/cleric/1', { json: true }, (error, response, body) => {
      expect(body).to.deep.equal({
        id: 1,
        name: 'test1'
      });
      done();
    });
  });

});
