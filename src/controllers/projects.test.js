
const PROJECT_URL = 'https://seedyfiuba-back-projects.herokuapp.com/api'

/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const { search, 
        getUserProjects, 
        getMyProjects,
        view, 
        create, 
        update, 
        destroy } = require('./projects');
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

test('/getUserProjects successful response', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto'
  const req = {
    id: 1,
    params: { id: 'userid1' },
    originalUrl: '/noimporta/search' + searchQuery
  }

  const wantedQuery = searchQuery + '&ownerid=' + req.params.id
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

  await getUserProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/getMyProjects successful response', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto'
  const req = {
    id: 'userid2',
    originalUrl: '/noimporta/search' + searchQuery
  }

  const wantedQuery = searchQuery + '&ownerid=' + req.id
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

  await getMyProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
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
});


test('/update successful response', async () => {

  const id = 1
  const ownerid = 'id1'
  const newData = {
    'att1': 'data',
    'att2': 'masData'
  }
  const req = {
    id: ownerid,
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
  }
  const getResponse = {
    data: {
      status: 'success',
      data: { ownerid }
    }
  }

  axios.get.mockReturnValue(getResponse);
  axios.patch.mockReturnValue(resObj);

  const res = mockResponse();

  await update(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/delete successful response', async () => {

  const id = 1
  const ownerid = 'id1'
  const req = {
    id: ownerid,
    params: { id }
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  }
  const getResponse = {
    data: {
      status: 'success',
      data: { ownerid }
    }
  }
  axios.get.mockReturnValue(getResponse);
  axios.delete.mockReturnValue(resObj);

  const res = mockResponse();

  await destroy(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});


