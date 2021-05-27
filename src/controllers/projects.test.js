
const PROJECT_URL = 'https://seedyfiuba-back-projects.herokuapp.com/api'

/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const { search, view, create, update } = require('./projects');
const { ApiError } = require('../errors/ApiError');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/search successful response', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto'
  const req = {
    id: 1,
    originalUrl: '/noimporta/search' + searchQuery
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };

  axios.get.mockReturnValue(resObj);

  const res = mockResponse();

  await search(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
  expect(axios.get).toHaveBeenCalledWith(PROJECT_URL + '/search' + searchQuery)
});


test('/search unsuccessful response with a given error code', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto'
  const req = {
    id: 1,
    originalUrl: '/noimporta/search' + searchQuery
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };
  
  const errorCode = 400 //Could be any

  axios.get.mockReturnValue(new Error({
    response:{
      data: {
        status: "error",
        error: "mock-error"
      },
      status: errorCode
    }
  }));

  const res = mockResponse();

  try{
    await search(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', errorCode);
  }
});


test('/view successful response', async () => {

  const id = 1
  const req = {
    params: { id }
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };

  axios.get.mockReturnValue(resObj);

  const res = mockResponse();

  await view(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
  expect(axios.get).toHaveBeenCalledWith(PROJECT_URL + '/view/' + id)
});

test('/create successful response', async () => {

  const id = 'ownerid'
  const originalBody = {
    'att1': 'data',
    'att2': 'masData'
  }
  const expectedBody = Object.assign({}, originalBody, { 'ownerid': id })
  const req = {
    id,
    body: originalBody
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };

  axios.post.mockReturnValue(resObj);

  const res = mockResponse();

  await create(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
  expect(axios.post).toHaveBeenCalledWith(PROJECT_URL, expectedBody)
});


test('/update successful response', async () => {

  const id = 1
  const newData = {
    'att1': 'data',
    'att2': 'masData'
  }
  const req = {
    params: { id },
    body: newData
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };

  axios.put.mockReturnValue(resObj);

  const res = mockResponse();

  await update(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
  expect(axios.put).toHaveBeenCalledWith(PROJECT_URL + '/' + id, newData)
});


