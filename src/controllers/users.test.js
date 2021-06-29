/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

const {
  me,
  getUser,
  post,
  updateMyProfile,
  adminPromoteUser,
  adminListUsers,
  adminGetUser
} = require('./users');
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

test('/getUser successful response', async () => {
  const req = {
    id: 1,
    params: { id: 'userid2' }
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
  await getUser(req, res);

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

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/updateMyProfile successful response', async () => {

  const req = {
    id: 1,
    body: {
      "firstname": "Omar",
      "lastname": "Garcia"
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: {
        ...req.body,
        "email": "mlopez@gmail.com",
        "birthdate": "1990-03-04",
      }
    }
  };

  axios.patch.mockReturnValue(resObj);

  const res = mockResponse();

  await updateMyProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/adminPromoteUser successful response', async () => {

  const req = {
    id: 'userid1',
    params: {
      id: 'userid2'
    }
  }

  const resObj = {
    data: {
      status: 'success',
      data: {
        "id": "userid2",
        "firstname": "Mockfirstname",
        "lastname": "Mocklastname",
        "email": "mlopez@gmail.com",
        "birthdate": "1990-03-04"
      }
    }
  };

  axios.patch.mockReturnValue(resObj);

  const res = mockResponse();

  await adminPromoteUser(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test('/adminGetUser successful response', async () => {
  const req = {
    id: 1,
    params: { id: 'userid2' }
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
  const viewObj = {
    data: {
      status: 'success',
      data: true
    }
  }

  const expectObj = {
    status: 'success',
    data: {
      ...resObj.data.data,
      isviewer: viewObj.data.data
    }
  }

  axios.get.mockReturnValueOnce(resObj).mockReturnValueOnce(viewObj);
  const res = mockResponse();
  await adminGetUser(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expectObj);
});

test('/adminListUsers successful response', async () => {
  const req = {
    id: 1,
    query: {
      page: 1,
      limit: 2
    },
    originalUrl: ".../admin/users?page=1&limit=2"
  }
  const resObj = {
    data: {
      status: 'success',
      data: [
      {
        "id": "uhasj31asidasdicaw",
        "firstname": "Marcelo",
        "lastname": "Lopez",
        "email": "mlopez@gmail.com"
      },
      {
        "id": "kdsaoijsaoiwqdsads",
        "firstname": "Esteban",
        "lastname": "Quito",
        "email": "equito@gmail.com"
      }
    ]
    }
  };

  axios.get.mockReturnValue(resObj);

  const res = mockResponse();
  await adminListUsers(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});
