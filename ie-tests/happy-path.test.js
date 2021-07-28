
const { createApp } = require('../src/app');
const { randomEmail } = require('./utils/utils');
const faker = require('faker');

const {
  getUid,
  getIdToken,
  firebaseLoginUser,
  users,
  firebaseCreateUser} = require('./utils/firebase.config');
const { testAuthorized } = require('./utils/auth');
const { getFakeProject } = require('./utils/utils')
const { BigNumber } = require('bignumber.js')
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

console.log(`AMOUNT DEL PROYECTO = ${data.stages[0].amount}, ${data.stages[1].amount}`)

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
    console.log(error.message);
  }
}

const createViewerWithAssertion = async function (data){
  await firebaseCreateUser(data);
  const token = await getIdToken();
  try {
    const response = await testAuthorized(app, 'post', '/users', token, {
      email: data.email,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      birthdate: '1990-03-04',
    }).expect(201)
    expect(response.body.status).toEqual('success');

    const viewerres = await testAuthorized(app, 'post', '/viewers', token).expect(201);
    expect(viewerres.body.status).toEqual('success');
  } catch (error) {
    console.log(error.message);
  }
}

const createUserWithAssertion = async function (data){
  await firebaseCreateUser(data);
  const token = await getIdToken();
  try {
    const response = await testAuthorized(app, 'post', '/users', token, {
      email: data.email,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      birthdate: '1990-03-04',
    }).expect(201)
    expect(response.body.status).toEqual('success');
  } catch (error) {
    console.log(error.message);
  }
}

const getEntrepreneurWalletBalanceWithAssertion = async function(){
  let balance = -1;
  const token = await getIdToken();
  try {
    const response = await testAuthorized(app, 'get', '/users/wallets/mine', token).expect(200)
    expect(response.body.status).toEqual('success');
    balance = response.body.data.balance//Number();
    console.log(`BALANCE = ${response.body.data.balance}`)
    return balance
  } catch (error) {
    console.log(error.message);
  }
}



// Comienzan los tests
describe('Correct Flow', function() {
  let pid = -1;
  let entrepreneurWalletBalance = -1;
  const seer2 = {
    email: randomEmail(),
    pass: 'Qwe12345'
  }
  const seer1 = {
    email: randomEmail(),
    pass: 'Qwe12345'
  }
  const seer3 = {
    email: randomEmail(),
    pass: 'Qwe12345'
  }
  const sponsor = {
    email: randomEmail(),
    pass: 'Qwe12345'
  }

  beforeAll(async () => {
    await createViewerWithAssertion(seer1);
    await createViewerWithAssertion(seer2);
    await createViewerWithAssertion(seer3);
    await createUserWithAssertion(sponsor);
    await firebaseLoginUser(users.entrepreneur);
    pid =  await createProjectWithAssertion();
    entrepreneurWalletBalance = await getEntrepreneurWalletBalanceWithAssertion();
  });

  it('Authorized response seer1', async (done) => {
    const path = `/projects/${pid}/review`;
    await firebaseLoginUser(seer1);
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
    await firebaseLoginUser(seer2);
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
    await firebaseLoginUser(seer3);
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
    await firebaseLoginUser(sponsor);
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

  it('Then owner continues with same wallet balance', async (done) => {
    await firebaseLoginUser(users.entrepreneur);
    const actualBalance = await getEntrepreneurWalletBalanceWithAssertion();
    expect(actualBalance).toEqual(entrepreneurWalletBalance)
    done();
  });

  it('Then project gets completly funded, with more eths that correspond', async (done) => {
    await firebaseLoginUser(sponsor);
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
        state: 'in_progress',
        actualstage: 0
      }))
      done();
    })
  });

  it('Then owner receives first stage amount', async (done) => {
    await firebaseLoginUser(users.entrepreneur);
    const actualBalance = await getEntrepreneurWalletBalanceWithAssertion();
    const am1 = new BigNumber(data.stages[0].amount)
    const baseBalance = new BigNumber(entrepreneurWalletBalance)
    expect(actualBalance).toEqual(baseBalance.plus(am1).toString())
    done();
  });

  it('Then project gets seer1 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer1);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 0 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project gets seer2 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer2);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 0 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Seer2 and Seer3 votes do not change project state nor stage, one left', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(expect.objectContaining({
        state: 'in_progress',
        actualstage: 0
      }))
      done();
    })
  });

  it('Then project gets seer3 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer3);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 0 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project change actual stage', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(expect.objectContaining({
        state: 'in_progress',
        actualstage: 1
      }))
      done();
    })
  });

  it('Then owner receives second and last stage amount', async (done) => {
    await firebaseLoginUser(users.entrepreneur);
    const actualBalance = await getEntrepreneurWalletBalanceWithAssertion();
    const am1 = new BigNumber(data.stages[0].amount)
    const am2 = new BigNumber(data.stages[1].amount)
    const baseBalance = new BigNumber(entrepreneurWalletBalance)
    expect(actualBalance).toEqual(baseBalance.plus(am1).plus(am2).toString())
    done();
  });

  it('Then project gets seer1 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer1);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 1 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project gets seer2 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer2);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 1 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project gets seer3 vote', async (done) => {
    const path = `/projects/${pid}/vote`;
    await firebaseLoginUser(seer3);
    const token = await getIdToken();
    testAuthorized(app, 'post', path, token, { 'stage': 1 })
    .expect(201)
    .then(response => {
      expect(response.body.status).toEqual('success');
      done();
    })
  });

  it('Then project change actual stage and state', async (done) => {
    const token = await getIdToken();
    const path = `/projects/${pid}`;
    testAuthorized(app, 'get', path, token)
    .expect(200)
    .then(response => {
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toMatchObject(expect.objectContaining({
        state: 'completed',
        actualstage: 2
      }))
      done();
    })
  });

});
