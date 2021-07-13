const axios = require('axios');
const USERS_URL = process.env.USERS_MS;
const { ApiError } = require('../errors/ApiError')
const errMsg = require("../errors/messages")

exports.adminValidation = async(req, res, next) => {
  let reqRes = 0;
  try {
    reqRes = await axios.get(USERS_URL + '/users/' + req.id)
  } catch(err){
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(errMsg.USER_NOT_FOUND)
    } else { throw err }
  }

  const user = reqRes.data.data
  if (!user.isadmin){
    throw ApiError.notAuthorized(errMsg.USER_NOT_ADMIN)
  }
  next();
};
