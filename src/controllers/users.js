'use strict'

const axios = require('axios');

const USERS_URL = process.env.USERS_MS;
const SPONSORS_URL = process.env.SPONSORS_MS;
const PAYMENT_URL = process.env.PAYMENT_GTW_MS;

exports.me = async(req, res, next) => {
  let reqRes = await axios.get(USERS_URL + '/users/' + req.id);
  const response = reqRes.data

  reqRes = await axios.get(SPONSORS_URL + '/viewers/' + req.id)
  response.data.isviewer = reqRes.data.data

  res.status(200).json(response);
};

exports.post = async(req, res, next) => {
  const reqRes = await axios.post(USERS_URL + '/users', {
    id: req.id,
    ... req.body
  });
  
  await axios.post(PAYMENT_URL + '/wallets', {
    ownerid: req.id
  });

  res.status(201).json(reqRes.data);
};

exports.updateMyProfile = async(req, res, next) => {
  const reqRes = await axios.patch(USERS_URL + '/users/' + req.id, req.body);

  res.status(200).json(reqRes.data);
};

exports.getUser = async(req, res, next) => {
  const reqRes = await axios.get(USERS_URL + '/users/' + req.params.id);

  res.status(200).json(reqRes.data);
};
