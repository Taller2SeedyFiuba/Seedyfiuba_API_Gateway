const { createApp } = require('../src/app');

const {
  getIdToken,
  firebaseLoginUser,
  getUid,
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

const projectResumeCheck = {
  title: data.title,
  type: data.type,
  icon: data.multimedia[0],
  state: 'on_review'
}

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

beforeAll(async () => {
  await firebaseLoginUser(users.entrepreneur);
});
let pid = -1;
// Comienzan los tests

describe('POST /projects', function() {
  const path = '/projects';

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
    pid =  await createProjectWithAssertion();
    done();
  });
});


describe('GET /projects/{id}', function() {
  it('Authorized response, success', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(projectCheck)
      done();
    })
  });

  it('Authorized response, not found', async (done) => {
    const token = await getIdToken();
    const pid = 1e8
    const path = `/projects/${pid}`;

    testAuthorized(app, 'get', path, token)
    .expect(404)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  });
});


describe('GET /projects/search', function() {
  it('Authorized response, success', async (done) => {
    const token = await getIdToken();
    const uid = await getUid();
    const path = `/projects/search?id=${pid}&ownerid=${uid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      //Dado que el proyecto se encuentra en 'on_review', es correcto que
      //no se muestre al realizar la busqueda publica.
      expect(response.body.data).toMatchObject([])
      done();
    })
  });

  it('Authorized response, bad request', async (done) => {
    const token = await getIdToken();
    const path = '/projects/search?lat=100' //No longitude or distance provide

    testAuthorized(app, 'get', path, token)
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  });
});


describe('GET /projects/mine', function() {

  it('Authorized response, success', async (done) => {
    const token = await getIdToken();
    const path = `/users/projects/mine`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toBeDefined()
      done();
    })
  });
});


describe('GET users/{uid}/projects', function() {

  it('Authorized response, success', async (done) => {
    const token = await getIdToken();
    const uid = await getUid();
    const path = `/users/${uid}/projects`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toBeDefined()
      done();
    })
  });
});


describe('PATCH /projects/{pid}', function() {
  it('Authorized response, success', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    const body = {
      'description': "Descripcion modificada"
    }
    testAuthorized(app, 'patch', path, token, body)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject({
        ...projectCheck,
        description: body.description
      })
      done();
    })
  });

  it('Authorized response, bad request', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    const body = {
      'title': "Title modificado"
    }
    testAuthorized(app, 'patch', path, token, body)
    .expect(400)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  });

  it('Authorized response, forbidden', async (done) => {
    //Cambiamos de usuario logueado
    await firebaseLoginUser({
      email: users.sponsor.email,
      pass: users.sponsor.pass
    });

    //Comenzamos el test
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    const body = {
      'description': "Descripcion modificada"
    }
    testAuthorized(app, 'patch', path, token, body)
    .expect(401)
    .then(response => {
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toBeDefined();
      done();
    })
  });
});
