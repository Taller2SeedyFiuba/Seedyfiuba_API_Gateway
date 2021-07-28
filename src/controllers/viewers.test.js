/** Mock Axios */
const axios = require('axios');
jest.mock('axios');

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
