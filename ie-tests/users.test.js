const request = require('supertest');
const { start } = require('../src/app');
const faker = require('faker');
const { getIdToken, firebaseCreateUser, getUid } = require('./utils/firebase.config');
const { testUnauthorized, testAuthorized } = require('./utils/auth');
const app = start();

let data = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  birthdate: '1990-03-04',
  email: faker.internet.email(),
}


describe('POST /users', function() {
  beforeAll(async () => {
    await firebaseCreateUser({
      ...data,
      pass: 'Qwe12345',
    });
  });

  const path = '/users';

  it('Unauthorized response', function(done) {
    testUnauthorized(app, 'post', path, done);
  });

  it('Bad formatted request', async function(done) {
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, {})
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Authorized response', async (done) => {
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, data)
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(data);
      done();
    })
  });
});

describe('GET /users/me', function() {
  const path = '/users/me';

  it('Unauthorized response', function(done) {
    testUnauthorized(app,'get', path, done);
  });
  
  it('Authorized response', async (done) => {
    const token = await getIdToken();
    testAuthorized(app, 'get', path, token, data)
    .expect(200, done);
  });
});

describe('GET /users/{id}/profile', function() {
  it('Unauthorized response', async function(done) {
    const uid = await getUid();
    const path = `/users/${uid}/profile/`;
    testUnauthorized(app,'get', path, done);
  });

  it('Authorized response, success', async (done) => {
    const uid = await getUid();
    const path = `/users/${uid}/profile/`;
    const token = await getIdToken();

    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(data);
      done();
    })
  });
  it('Authorized response, not found', async (done) => {
    const uid = 'not-exists'
    const path = `/users/${uid}/profile/`;
    const token = await getIdToken();

    testAuthorized(app, 'get', path, token)
    .expect(404)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  });
});