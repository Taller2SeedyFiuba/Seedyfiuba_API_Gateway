'use strict'

const axios = require('axios');
const { pick, getQueryString } = require('../utils/util')
const { services } = require('../config')
const privateAttributes = [
  'id',
  'firstname',
  'lastname',
  'email',
  'birthdate',
  'signindate'
]

const publicAttributes = [
  'id',
  'firstname',
  'lastname',
  'email',
  'birthdate',
  'signindate'
]

exports.me = async(req, res, next) => {
  let reqRes = await axios.get(services.users + '/users/' + req.id);
  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);

  reqRes = await axios.get(services.sponsors + '/viewers/' + req.id)
  response.data.isviewer = reqRes.data.data

  res.status(200).json(response);
};

exports.post = async(req, res, next) => {
  const reqRes = await axios.post(services.users + '/users', {
    id: req.id,
    ... req.body
  });

  await axios.post(services.payments + '/wallets', {
   ownerid: req.id
  });

  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);
  res.status(201).json(response);
};

exports.updateMyProfile = async(req, res, next) => {
  const reqRes = await axios.patch(services.users + '/users/' + req.id, req.body);
  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);

  res.status(200).json(response);
};

exports.getUser = async(req, res, next) => {
  const reqRes = await axios.get(services.users + '/users/' + req.params.id);
  const response = reqRes.data
  response.data = pick(response.data, publicAttributes);
  res.status(200).json(response);
};

exports.adminPromoteUser = async(req, res, next) => {

  const id = req.params.id
  const body = {
    isadmin: true
  }
  const reqRes = await axios.patch(services.users + '/users/' + id, body);

  res.status(200).json(reqRes.data);
};

exports.adminListUsers = async(req, res, next) => {
  const query = getQueryString(req.originalUrl)

  const reqRes = await axios.get(services.users + '/users/' + query);

  res.status(200).json(reqRes.data);
};

exports.adminGetUser = async(req, res, next) => {
  let reqRes = await axios.get(services.users + '/users/' + req.params.id);
  const response = reqRes.data
  reqRes = await axios.get(services.sponsors + '/viewers/' + req.params.id)
  response.data.isviewer = reqRes.data.data

  res.status(200).json(response);
};
