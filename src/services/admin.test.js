/** Mock Axios */
const axios = require('axios');
jest.mock('axios');
const { ApiError } = require('../errors/ApiError')

const {
  adminValidation
} = require('./admin');


const mockResponse = () => {
const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/adminValidation successful response', async () => {
  const req = {
    id: 1
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": "uhasj31asidasdicaw",
        "firstname": "Marcelo",
        "lastname": "Lopez",
        "email": "mlopez@gmail.com",
        "birthdate": "1990-03-04",
        "signindate": "2020-11-10T16:49:52.214Z",
        "isadmin": true
      }
    }
  };

  axios.get.mockReturnValue(resObj);
  const next = jest.fn()
  const res = mockResponse();

  await adminValidation(req, res, next);

  expect(next.mock.calls.length).toBe(1);
});

test('/adminValidation unsuccessful response, 401 not authorized', async () => {
  const req = {
    id: 1
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": "uhasj31asidasdicaw",
        "firstname": "Marcelo",
        "lastname": "Lopez",
        "email": "mlopez@gmail.com",
        "birthdate": "1990-03-04",
        "signindate": "2020-11-10T16:49:52.214Z",
        "isadmin": false
      }
    }
  };

  axios.get.mockReturnValue(resObj);
  const next = jest.fn()
  const res = mockResponse();

  try{
    await adminValidation(req, res, next);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 401);
    expect(next.mock.calls.length).toBe(0);
  }
});

test('/adminValidation unsuccessful response, 400 user is not registered', async () => {
  const req = {
    id: 1
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "noimporta": "noimporta"
      }
    }
  };

  axios.get.mockImplementation(async () => {
    throw {
      response: {
        status: ApiError.codes.notFound
      }
    }
  })
  const next = jest.fn()
  const res = mockResponse();

  try{
    await adminValidation(req, res, next);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);
    expect(next.mock.calls.length).toBe(0);
  }
});
