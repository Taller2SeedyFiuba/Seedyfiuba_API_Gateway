


/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const { me, post } = require('./users');
const { ApiError } = require('../errors/ApiError');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/me successful response', async () => {
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
        "signindate": "2020-11-10T16:49:52.214Z"
      }
    }
  };

  axios.get.mockReturnValue(resObj);

  const res = mockResponse();

  await me(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/post successful response', async () => { 
  const resObj = {
    data: {
      status: 'success',
      data: {
        "firstname": "Marcelo",
        "lastname": "Lopez",
        "email": "mlopez@gmail.com",
        "birthdate": "1990-03-04",
      }
    }
  };

  const req = {
    id: 1,
    body: {}
  }
  axios.post.mockReturnValue(resObj);

  const res = mockResponse();

  await post(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/post unsuccessful response 400 error code', async () => { 
  const req = {
    id: 1,
    body: {}
  }

  axios.post.mockReturnValue(new Error({
    response:{
      data: {
        status: "error",
        error: "mock-error"
      },
      status: 400
    }
  }));

  const res = mockResponse();

  try{
    await post(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);
  }
});