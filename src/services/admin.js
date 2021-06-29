const axios = require('axios');
const USERS_URL = process.env.USERS_MS;
const { ApiError } = require('../errors/ApiError')

exports.adminValidation = async(req, res, next) => {
  const reqRes = await axios.get(USERS_URL + '/users/' + req.id);
  const user = reqRes.data.data
  if (!user.isadmin){
    throw ApiError.notAuthorized('user-is-not-admin')
  }
  next();
};