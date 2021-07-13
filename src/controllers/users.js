'use strict'

const axios = require('axios');
const { pick, getQueryString } = require('../utils/util')
const USERS_URL = process.env.USERS_MS;
const SPONSORS_URL = process.env.SPONSORS_MS;
const PAYMENT_URL = process.env.PAYMENT_GTW_MS;

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
  let reqRes = await axios.get(USERS_URL + '/users/' + req.id);
  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);

  reqRes = await axios.get(SPONSORS_URL + '/viewers/' + req.id)
  response.data.isviewer = reqRes.data.data

  res.status(200).json(response);
};

exports.post = async(req, res, next) => {
  const reqRes = await axios.post(USERS_URL + '/users', {
    id: req.id,
    ... req.body
  });

  //await axios.post(PAYMENT_URL + '/wallets', {
  //  ownerid: req.id
  //});
  //Devolver info de la wallet?
  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);
  res.status(201).json(response);
};

exports.updateMyProfile = async(req, res, next) => {
  const reqRes = await axios.patch(USERS_URL + '/users/' + req.id, req.body);
  const response = reqRes.data
  response.data = pick(response.data, privateAttributes);

  res.status(200).json(response);
};

exports.getUser = async(req, res, next) => {
  const reqRes = await axios.get(USERS_URL + '/users/' + req.params.id);
  const response = reqRes.data
  response.data = pick(response.data, publicAttributes);
  res.status(200).json(response);
};

exports.adminPromoteUser = async(req, res, next) => {

  const id = req.params.id
  const body = {
    isadmin: true
  }
  const reqRes = await axios.patch(USERS_URL + '/users/' + id, body);

  res.status(200).json(reqRes.data);
};

exports.adminListUsers = async(req, res, next) => {
  const query = getQueryString(req.originalUrl)

  const reqRes = await axios.get(USERS_URL + '/users/' + query);
  //Se podria hacer un especie de resumen de usuario al igual que en proyectos.
  //Ya sea aca o en el micro de usuarios. Por ejemplo id, firstname, email, isadmin
  res.status(200).json(reqRes.data);
};

exports.adminGetUser = async(req, res, next) => {
  let reqRes = await axios.get(USERS_URL + '/users/' + req.params.id);
  const response = reqRes.data
  reqRes = await axios.get(SPONSORS_URL + '/viewers/' + req.params.id)
  response.data.isviewer = reqRes.data.data

  res.status(200).json(response);
};
