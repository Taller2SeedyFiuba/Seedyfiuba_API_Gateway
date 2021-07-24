/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const {
  search,
  view,
  create,
  update,
  adminGetProject,
  adminListProjects } = require('./projects');

const rewire = require("rewire"); //To test non-exported functions
const rewireImport = rewire("./projects");

const { ApiError } = require('../errors/ApiError');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks()
})

test('/search successful response', async () => {

  const req = {
    id: 1,
    query: {
      type: 'software',
      tags: 'BuenProyecto'
    }
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

test('/search unsuccessful error, wrong state', async () => {

  const req = {
    id: 1,
    query: {
      type: 'software',
      tags: 'BuenProyecto',
      state: 'on_review'
    }
  }

  const res = mockResponse();

  expect.assertions(2)

  try{
    await search(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toHaveProperty('code', 400);
  }
});

test('/search unsuccessful response, axios error', async () => {

  const req = {
    id: 1,
    query: {
      type: 'software',
      tags: 'BuenProyecto'
    }
  }

  const res = mockResponse();
  const expectedError = new Error('error-message')

  axios.get.mockImplementation(() => {
    throw expectedError
  });

  expect.assertions(2)

  try{
    await search(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toEqual(expectedError);
  }
});


test('/getUserProjectsAux successful response', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto'
  const id = 'userid1'
  const req = {
    originalUrl: '/noimporta/search' + searchQuery
  }

  const wantedQuery = searchQuery + '&ownerid=' + id
  const resObj = {
    data: {
      status: 'success',
      data: {
        "unCampo": "EstoNoSeVaAChequear"
      }
    }
  };

  const mockAxiosGet = axios.get.mockReturnValue(resObj);

  const getUserProjectsAux = rewireImport.__get__('getUserProjectsAux')
  rewireImport.__set__('axios.get', mockAxiosGet)

  const res = mockResponse();

  await getUserProjectsAux(req, res, id);

  expect(axios.get.mock.calls[0][0]).toContain(wantedQuery)
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/view successful response, owner request', async () => {

  const req = {
    id: 'ownerid',
    params: { id: 1 }
  }
  const projectResponse = {
    data: {
      status: 'success',
      data: {
        'privateAttribute': 'super-secret',
        'ownerid': 'ownerid' //Project is owned by the user making the request
      }
    }
  };
  const sponsorResponse = {
    data: {
      status: 'success',
      data: []
    }
  };
  const expectedResponse = {
    status: 'success',
    data: {
      'privateAttribute': 'super-secret',
      'ownerid': 'ownerid',
      'isfavourite': false
    }
  }

  axios.get.mockReturnValueOnce(projectResponse);
  axios.get.mockReturnValueOnce(sponsorResponse);

  const res = mockResponse();
  await view(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expectedResponse);
});

test('/view successful response, non-owner request', async () => {

  const req = {
    id: 'not-the-owner',
    params: { id: 1 }
  }
  const projectResponse = {
    data: {
      status: 'success',
      data: {
        'privateAttribute': 'super-secret',
        'ownerid': 'ownerid' //Project is owned by the user making the request
      }
    }
  };
  const sponsorResponse = {
    data: {
      status: 'success',
      data: ['an-element']  //To trigger true in 'isfavourite'
    }
  };
  const expectedResponse = {
    status: 'success',
    data: {
      'ownerid': 'ownerid',
      'isfavourite': true
    }
  }

  axios.get.mockReturnValueOnce(projectResponse);
  axios.get.mockReturnValueOnce(sponsorResponse);

  const res = mockResponse();
  await view(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expectedResponse);
});

test('/view axios error', async () => {

  const req = {
    params: { id: 1 }
  }

  const res = mockResponse();
  const expectedError = new Error('error-message')

  axios.get.mockImplementation(() => {
    throw expectedError
  });

  expect.assertions(2)

  try{
    await view(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toEqual(expectedError);
  }
});

test('/create successful response', async () => {

  const id = 'ownerid'
  const originalBody = {
    'att1': 'data',
    'att2': 'masData',
    'stages': [10, 20, 300]
  }

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

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/create axios error', async () => {

  const id = 'ownerid'
  const originalBody = {
    'att1': 'data',
    'att2': 'masData',
    'stages': [10, 20, 300]
  }
  const req = {
    id,
    body: originalBody
  }
  const res = mockResponse();
  const expectedError = new Error('error-message')

  axios.post.mockImplementation(() => {
    throw expectedError
  });

  expect.assertions(2)

  try{
    await create(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toEqual(expectedError);
  }
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


test('/update axios error', async () => {

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

  const res = mockResponse();
  const expectedError = new Error('error-message')

  axios.get.mockImplementation(() => {
    throw expectedError
  });

  expect.assertions(2)

  try{
    await update(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toEqual(expectedError);
  }
});

test('/adminGetProject succesful response', async () => {

  const req = {
    id: 'admin-id',
    params: { id: 1 }
  }
  const projectResponse = {
    data: {
      status: 'success',
      data: {
        'privateAttribute': 'super-secret',
        'ownerid': 'random-user-id' //Admin is not the project's owner
      }
    }
  };
  const sponsorResponse = {
    data: {
      status: 'success',
      data: []
    }
  };
  const expectedResponse = {
    status: 'success',
    data: {
      'privateAttribute': 'super-secret',
      'ownerid': 'random-user-id',
      'isfavourite': false
    }
  }

  axios.get.mockReturnValueOnce(projectResponse);
  axios.get.mockReturnValueOnce(sponsorResponse);

  const res = mockResponse();
  await adminGetProject(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expectedResponse);
});

test('/adminListProjects successful response', async () => {

  const searchQuery = '?type=software&tags=BuenProyecto&state=on_review' //Admin can list 'on_review' projects
  const req = {
    id: 1,
    query: {
      type: 'software',
      tags: 'BuenProyecto',
      state: 'on_review'
    },
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

  await adminListProjects(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});
