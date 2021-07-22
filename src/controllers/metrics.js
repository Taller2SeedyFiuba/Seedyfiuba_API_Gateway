'use strict'

const axios = require('axios');
const { services }  = require('../config')
const { getQueryString } = require('../utils/util')
const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')


const getMetrics = async function(req, res, next){

  const query = getQueryString(req.originalUrl)
  let metrics = {}

  let reqRes = await axios.get(services.users + '/metrics' + query);

  metrics = {
    ...reqRes.data.data
  }

  reqRes = await axios.get(services.sponsors + '/metrics' + query);

  metrics = {
    ...metrics,
    ...reqRes.data.data
  }

  reqRes = await axios.get(services.projects + '/metrics' + query);

  metrics = {
    ...metrics,
    ...reqRes.data.data
  }

  res.status(200).json({
    status: 'success',
    data: metrics
  });
}

module.exports = {
  getMetrics
}
