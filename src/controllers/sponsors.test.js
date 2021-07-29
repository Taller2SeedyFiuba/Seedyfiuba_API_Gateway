/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const {
  addSponsor,
  getMySponsors,
  addFavourite,
  getMyFavourites
} = require('./sponsors');

const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks()
})

test('/addSponsor successful response', async () => {
  const req = {
    id: 'userid',
    body: {
      amount: 20
    },
    params: {
      projectid: 1
    }
  }

  const projectResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "entrepreneurid",
        "state": "funding"
      }
    }
  };

  const paymentResponse = {
    data: {
      status: 'success',
      data: {
        "amount": "13.15",
        "missingAmount": "10.53",
        "state": "funding"
      }
    }
  };

  const sponsorResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "entrepreneurid",
        "newsponsor": true
      }
    }
  };

  const resp = {
    status: 'success',
    data: {
      "userid": "userid",
      "projectid": 1,
      "amount" : "13.15"
    }
  }

  axios.get
    .mockReturnValueOnce(projectResponse)

  axios.post
    .mockReturnValueOnce(paymentResponse)
    .mockReturnValueOnce(sponsorResponse)

  const res = mockResponse();

  await addSponsor(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resp);
});

test('/addSponsor error, project not found', async () => {
  const req = {
    id: 'userid',
    body: {
      amount: 20
    },
    params: {
      projectid: 1
    }
  }

  const expectedError = ApiError.badRequest('message-from-service')

  const axiosError = {
    response: {
      status: 404, //Project not found
      data: {
        status: 'error',
        message: 'message-from-service'
      }
    }
  }

  axios.get.mockImplementationOnce(() => {
    throw axiosError
  });

  const res = mockResponse();

  expect.assertions(2)

  try{
    await addSponsor(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toEqual(expectedError);
  }
});


test('/addSponsor error, owner cant sponsor', async () => {
  const req = {
    id: 'userid',
    body: {
      amount: 20
    },
    params: {
      projectid: 1
    }
  }

  const projectResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "userid",  //Same as user making the request
        "state": "funding"
      }
    }
  };

  const expectedError = ApiError.badRequest(errMsg.OWNER_CANT_SPONSOR)

  const res = mockResponse();

  axios.get
    .mockReturnValueOnce(projectResponse)

  expect.assertions(2)

  try{
    await addSponsor(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toEqual(expectedError);
  }
});

test('/addSponsor error, project not on funding', async () => {
  const req = {
    id: 'userid',
    body: {
      amount: 20
    },
    params: {
      projectid: 1
    }
  }

  const projectResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "ownerid",  //Same as user making the request
        "state": "on_review"
      }
    }
  };

  const expectedError = ApiError.badRequest(errMsg.PROJECT_NOT_ON_FUNDING)

  const res = mockResponse();

  axios.get
    .mockReturnValueOnce(projectResponse)

  expect.assertions(2)

  try{
    await addSponsor(req, res);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toEqual(expectedError);
  }
});


test('/getMySponsors successful response', async () => {
  const req = {
    id: 'userid',
    query: {
      limit: 5,
      page: 2,
      projectid: 6
    }
  }

  const sponsorResponse = {
    data: {
      status: 'success',
      data: [
        {
          'userid': 'userid',
          'projectid': 3
        }
      ]
    }
  };

  const projectResponse = {
    data: {
      status: 'success',
      data: [
        {
          'ownerid': 'userid',
          'id': 3,
          'noimporta': 'no-importa'
        },
        {
          'ownerid': 'userid',
          'id': 2,
          'noimporta': 'no-importa'
        }
      ]
    }
  };

  const resp = {
    status: 'success',
    data: projectResponse.data.data
  }

  axios.get
    .mockReturnValueOnce(sponsorResponse)
    .mockReturnValueOnce(projectResponse)


  const res = mockResponse();

  await getMySponsors(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resp);
});


test('/addFavourite successful response', async () => {
  const req = {
    id: 'userid',
    body: {
      amount: 20
    },
    params: {
      projectid: 1
    }
  }

  const projectResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "entrepreneurid",
        "state": "funding"
      }
    }
  };

  const paymentResponse = {
    data: {
      status: 'success',
      data: {
        "amount": "13.15",
        "missingAmount": "10.53",
        "state": "funding"
      }
    }
  };

  const sponsorResponse = {
    data: {
      status: 'success',
      data: {
        "ownerid": "entrepreneurid",
        "newsponsor": true
      }
    }
  };

  const resp = {
    status: 'success',
    data: {
      "userid": "userid",
      "projectid": 1,
      "amount" : "13.15"
    }
  }

  axios.get
    .mockReturnValueOnce(projectResponse)

  axios.post
    .mockReturnValueOnce(paymentResponse)
    .mockReturnValueOnce(sponsorResponse)

  const res = mockResponse();

  await addSponsor(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resp);
});
