/** Mock Axios */
const axios = require('axios');
jest.mock('axios');
jest.mock('../services/notifications');

const {
  subscribeToViewing,
  addProject,
  getMyReviews,
  getProjectsOnReview,
  voteProject
} = require('./viewers');

const { ApiError } = require('../errors/ApiError');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('/subscribeToViewing successful response', async () => {
  const req = {
    id: 1
  }
  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": "uhasj31asidasdicaw"
      }
    }
  };

  axios.post.mockReturnValue(resObj);

  const res = mockResponse();

  await subscribeToViewing(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});


test('/addProject successful response', async () => {
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
        "state": "on_review"
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
        "userid": "viewerid",
        "projectid": 5
      }
    }
  };

  const resp = {
    status: 'success',
    data: {
      "userid": "viewerid",
      "projectid": 5
    }
  }

  axios.get
    .mockReturnValueOnce(projectResponse)

  axios.post
    .mockReturnValueOnce(paymentResponse)
    .mockReturnValueOnce(sponsorResponse)

  axios.patch
    .mockReturnValueOnce({'does-not-matter': 5})

  const res = mockResponse();

  await addProject(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resp);
});


test('/getMyReviews successful response', async () => {
  const req = {
    id: 'userid',
    query: {
      limit: 5,
      page: 2,
      projectid: 6
    }
  }

  const firstSponsorResponse = {
    data: {
      status: 'success',
      data: true
    }
  };

  const secondSponsorResponse = {
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
    .mockReturnValueOnce(firstSponsorResponse)
    .mockReturnValueOnce(secondSponsorResponse)
    .mockReturnValueOnce(projectResponse)


  const res = mockResponse();

  await getMyReviews(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resp);
});


test('/getProjectsOnReview successful response', async () => {
  const req = {
    id: 'userid',
    query: {
      limit: 5,
      page: 2,
    }
  }

  const sponsorResponse = {
    data: {
      status: 'success',
      data: true
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

  await getProjectsOnReview(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resp);
});


test('/voteProject successful response', async () => {
  const req = {
    id: 'userid',
    body: {
      stage: 1
    },
    params: {
      projectid: 1
    }
  }

  const projectResponse = {
    data: {
      status: 'success',
      data: {
        "id": 1,
        "ownerid": "entrepreneurid",
        "state": "in_progress",
        "actualstage": 1,
        "title": "A very good title"
      }
    }
  };

  const sponsorResponse = {
    data: {
      status: 'success',
      data: {
        "userid": "viewerid",
        "projectid": 5
      }
    }
  };

  const paymentResponse = {
    data: {
      status: 'success',
      data: {
        "amount": "13.15",
        "missingAmount": "10.53",
        "state": "funding",
        "currentStage": 2
      }
    }
  };

  const projectPatchResponse = {
    data: {
      status: 'success',
      data: {
        "does-not-matter": 5
      }
    }
  };


  const resp = {
    status: 'success',
    data: {
      "userid": "viewerid",
      "projectid": 5
    }
  }

  axios.get
    .mockReturnValueOnce(projectResponse)

  axios.post
    .mockReturnValueOnce(sponsorResponse)
    .mockReturnValueOnce(paymentResponse)

  axios.patch
    .mockReturnValueOnce(projectPatchResponse)

  const res = mockResponse();

  await voteProject(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resp);
});
