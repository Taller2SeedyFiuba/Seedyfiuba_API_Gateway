const axios = require('axios');
const USERS_URL = process.env.USERS_MS;
const { ApiError } = require('../errors/ApiError')

exports.adminValidation = async(req, res, next) => {

  //const reqRes = await axios.get(USERS_URL + '/users/' + req.id).
  //catch(err => {
  //  if (err.response && err.response.status == ApiError.codes.notFound){
  //    throw ApiError.badRequest('user-is-not-registered')
  //  } else { throw err }
  //})

  let reqRes = 0;
  try {
    reqRes = await axios.get(USERS_URL + '/users/' + req.id)
  } catch(err){
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest('user-is-not-registered')
    } else { throw err }
  }

  const user = reqRes.data.data
  if (!user.isadmin){
    throw ApiError.notAuthorized('user-is-not-admin')
  }
  next();
};
