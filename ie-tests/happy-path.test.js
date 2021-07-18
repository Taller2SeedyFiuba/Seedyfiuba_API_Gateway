const request = require('supertest');
const { createApp } = require('../src/app');
const faker = require('faker');
const {
  getUid,
  getIdToken,
  firebaseLoginUser,
  users } = require('./utils/firebase.config');
const { testAuthorized } = require('./utils/auth');
const { getFakeProject } = require('./utils/utils')
const app = createApp();

const data = getFakeProject();

const projectCheck = {
  title: data.title,
  description: data.description,
  location: data.location,
  type: data.type,
  multimedia: expect.arrayContaining(data.multimedia),
  tags: expect.arrayContaining(data.tags),
  stages: expect.arrayContaining(data.stages)
}

const createProjectWithAssertion = async function (){
  let pid = -1
  const token = await getIdToken();
  try {
    const response = await testAuthorized(app, 'post', '/projects', token, data).expect(201)
    expect(response.body.status).toEqual('success');
    expect(response.body.data).toEqual(expect.objectContaining(projectCheck))
    pid = response.body.data.id;
    return pid
  } catch (error) {
    console.log(error);
  }
}

// Comienzan los tests
describe('Correct Flow', function() {
  let pid = -1;
  beforeAll(async () => {
    await firebaseLoginUser(users.entrepreneur);
    pid =  await createProjectWithAssertion();
  });

  it('Authorized response seer1', async (done) => {
    const path = `/projects/${pid}/review`;
    await firebaseLoginUser(users.seer1);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, {})
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Authorized response seer2', async (done) => {
    const path = `/projects/${pid}/review`;
    await firebaseLoginUser(users.seer2);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, {})
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Authorized response seer3', async (done) => {
    const path = `/projects/${pid}/review`;
    await firebaseLoginUser(users.seer3);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, {})
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project is in funding state', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(expect.objectContaining({
        state: 'funding'
      }))
      done();
    })
  });

  it('Then project gets a sponsor added', async (done) => {
    await firebaseLoginUser(users.sponsor);
    const token = await getIdToken();
    const uid = await getUid();
    const path = `/projects/${pid}/sponsors`;
    testAuthorized(app, 'post', path, token, {
      amount: data.stages[0].amount,
    })
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject({
        "amount": data.stages[0].amount,
        "projectid": `${pid}`,
        "userid": uid,
      })
      done();
    })
  });

  it('Then project gets completly funded, with more eths that correspond', async (done) => {
    await firebaseLoginUser(users.sponsor);
    const token = await getIdToken();
    const uid = await getUid();
    const path = `/projects/${pid}/sponsors`;
    testAuthorized(app, 'post', path, token, {
      amount: data.stages.reduce((reducer, stage) => reducer + Number(stage.amount), 0)
    })
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject({
        "amount": data.stages[1].amount,
        "projectid": `${pid}`,
        "userid": uid,
      })
      done();
    })
  });

  it('Then project is in progress state', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(expect.objectContaining({
        state: 'in_progress'
      }))
      done();
    })
  });
});