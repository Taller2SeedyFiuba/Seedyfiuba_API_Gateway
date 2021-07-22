const request = require('supertest');
const { createApp } = require('../../src/app');
const faker = require('faker');
const {
  getIdToken,
  firebaseCreateUser,
  firebaseLoginUser,
  getUid,
  users,
  loginUser} = require('../utils/firebase.config');
const { testUnauthorized, testAuthorized } = require('../utils/auth');
const app = createApp();

const normalUserData = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  birthdate: '1990-03-04',
  email: faker.internet.email()
}

users.normalUser = {
  email: normalUserData.email,
  pass: 'Qwe12345'
}

beforeAll(async () => {
  await firebaseCreateUser(users.normalUser);
  const token = await getIdToken();
  const path = '/users'
  return testAuthorized(app, 'post', path, token, normalUserData)
  .expect(201)
  .then(response => {
    expect(response.body.status).toEqual('success');
    expect(response.body.data).toBeDefined();
  })
});

const logAdmin = async () => {
  return loginUser(users.root)
}

const logNormalUser = async () => {
  return loginUser(users.normalUser)
}

describe('GET /admin/users', function() {
  const path = '/admin/users';

  it('Unauthorized response, not a firebase account', function(done) {
    testUnauthorized(app, 'get', path, done);
  });

  it('Unauthorized response, not an admin', async function(done) {
    const { token } = await logNormalUser();
    testAuthorized(app, 'get', path, token)
    .expect(401)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBe('user-is-not-admin');
      done();
    })
  });

  it('Bad formatted request', async function(done) {
    const { token } = await logAdmin();
    const queryPath = path.concat('?page=-1&limit=0');

    await testAuthorized(app, 'get', queryPath, token)
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Success response', async (done) => {
    const { token } = await logAdmin();
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toBeInstanceOf(Array)
      done();
    })
  });
});

describe('GET /admin/user/{id}', function() {
  const basePath = '/admin/users';

  it('Unauthorized response, not a firebase account', function(done) {
    const path = basePath + '/noimporta'
    testUnauthorized(app, 'get', path, done);
  });

  it('Unauthorized response, not an admin', async function(done) {
    const path = basePath + '/noimporta'
    const { token } = await logNormalUser();
    testAuthorized(app, 'get', path, token)
    .expect(401)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBe('user-is-not-admin');
      done();
    })
  });

  it('Not found request', async function(done) {
    const path = basePath + '/noexiste'
    const { token } = await logAdmin();

    await testAuthorized(app, 'get', path, token)
    .expect(404)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Success response', async (done) => {
    const { uid } = await logNormalUser();
    const { token } = await logAdmin();
    const path = basePath + '/' + uid
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(normalUserData)
      done();
    })
  });
});

describe('PATCH /admin/user/{id}', function() {
  const basePath = '/admin/users';

  it('Unauthorized response, not a firebase account', function(done) {
    const path = basePath + '/noimporta'
    testUnauthorized(app, 'patch', path, done);
  });

  it('Unauthorized response, not an admin', async function(done) {
    const path = basePath + '/noimporta'
    const { token } = await logNormalUser();
    testAuthorized(app, 'patch', path, token)
    .expect(401)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBe('user-is-not-admin');
      done();
    })
  });

  it('Not found request', async function(done) {
    const path = basePath + '/noexiste'
    const { token } = await logAdmin();

    await testAuthorized(app, 'patch', path, token)
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Success response', async (done) => {
    const { uid } = await logNormalUser();
    const { token } = await logAdmin();
    const path = basePath + '/' + uid
    testAuthorized(app, 'patch', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toEqual(
        expect.objectContaining({
          isadmin: true
        })
      )
      done();
    })
  });
});

