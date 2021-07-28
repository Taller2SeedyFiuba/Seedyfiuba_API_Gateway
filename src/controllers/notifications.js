'use strict'

const axios = require('axios');
const { services }  = require('../config')
const { toQueryString } = require('../utils/util')
const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

exports.updateToken = async(req, res, next) => {

  const body = {
    id: req.id,
    token: req.body.token
  }

  const response = await axios.put(services.notifications + '/users', body)

  res.status(200).json(response.data);
}

exports.subscribeToProject = async(req, res, next) => {

  const body = {
    userid: req.id,
    projectid: req.params.projectid
  }

  const response = await axios.post(services.notifications + '/subscribers', body)

  res.status(201).json(response.data);
}

exports.deleteSubscription = async(req, res, next) => {
  const uri = '/subscribers/' + req.id + '/projects/' + req.params.projectid

  const response = await axios.delete(services.notifications + uri)

  res.status(200).json(response.data);
}

exports.getMySubscriptions = async(req, res, next) => {

  req.query = {
    ...req.query,
    limit: (req.query.limit || 10),
    page: (req.query.page || 1),
    userid: req.id
  }

  const query = toQueryString(req.query)

  const response = await axios.get(services.notifications + '/subscribers' + query)

  res.status(200).json(response.data);
}


