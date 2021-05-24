

/** Mock Firebase-auth service */
const admin = require('firebase-admin');
jest.mock('firebase-admin');
admin.auth = jest.fn()

const { authorize } = require('./auth');
const { ApiError } = require('../errors/ApiError');

test('Auth Invalid Token', async (done) => {
  const req = {
    headers: {
      authorization: 'Bearer TEST'
    }
  }
  try {
    await authorize(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 401);
    done();
  }
});

test('Auth No Token', async (done) => {
  const req = {
    headers: {}
  };

  try {
    await authorize(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 401);
    done();
  }
});

test('Auth Valid Token', async (done) => {
  const req = {
    headers: {
      authorization: 'Bearer JWTTOKEN'
    }
  };

  admin.auth.mockReturnValue({
    verifyIdToken: () => Promise.resolve({
      uid: 1
    })
  })

  try {
    await authorize(req, {}, () => {
      expect(req).toHaveProperty('id', 1);
      done();
    });
  } catch (err) {
    done(err);
  }
});