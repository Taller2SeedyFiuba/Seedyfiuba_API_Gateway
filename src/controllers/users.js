'use strict'

const axios = require('axios');
const URL = process.env.USERS_MS;

exports.me = async(req, res, next) => {
  const reqRes = await axios.get(URL + '/users/' + req.id);
  res.status(200).json(reqRes.data);
};

exports.post = async(req, res, next) => {
  const reqRes = await axios.post(URL + '/users', {
      id: req.id,
      ... req.body
    });

  res.status(201).json(reqRes.data);
};

exports.getUser = async(req, res, next) => {
  const reqRes = await axios.get(URL + '/users/' + req.params.id);

  res.status(200).json(reqRes.data);
};
