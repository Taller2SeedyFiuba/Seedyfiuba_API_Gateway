const { createApp } = require('../../src/app');
const faker = require('faker');
const {
  getIdToken,
  loginUser,
  users } = require('../utils/firebase.config');
const { testAuthorized } = require('../utils/auth');
const { getFakeProject } = require('../utils/utils')
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

let pid = -1;

const createProjectWithAssertion = async function (){
  let pid = -1
  const token = await getIdToken();
  await testAuthorized(app, 'post', '/projects', token, data)
  .expect(201)
  .then(response => {
    expect(response.body.status).toEqual('success');
    expect(response.body.data).toEqual(expect.objectContaining(projectCheck))
    pid = response.body.data.id
  })
  return pid
}

const logAdmin = async () => {
  return loginUser(users.root)
}

const logEntrepreneur = async () => {
  return loginUser(users.entrepreneur)
}

beforeAll(async (done) => {
  await logAdmin();
  done();
});

describe('GET /admin/projects', function() {
  const basePath = '/admin/projects';

  //La autorizacion de admin y firebase ya ha sido testeada

  it('Bad formatted request', async function(done) {
    const token = await getIdToken();
    const queryPath = basePath.concat('?page=-1&limit=0');

    await testAuthorized(app, 'get', queryPath, token)
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Success response', async (done) => {
    const token = await getIdToken();
    testAuthorized(app, 'get', basePath, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toBeInstanceOf(Array)
      done();
    })
  });
});


describe('GET /admin/projects', function() {
  const basePath = '/admin/projects/';

  //La autorizacion de admin y firebase ya ha sido testeada

  it('Not found request', async function(done) {
    const token = await getIdToken();
    const path = basePath + 1e6;

    await testAuthorized(app, 'get', path, token)
    .expect(404)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  })

  it('Test preparation: Create a new project to test', async (done) => {
    await logEntrepreneur();
    pid = await createProjectWithAssertion();
    done();
  });

  it('Success response', async (done) => {
    const { token } = await logAdmin();
    const path = basePath + pid;

    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.data).toBeDefined();
      expect(response.body.status).toEqual('success');
      done();
    })
  });
});


