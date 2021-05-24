'use strict'

const axios = require('axios');
const URL = 'https://seedyfiuba-back-users.herokuapp.com/api';

const { msErrorHandler } = require('../errors/handler');

exports.me = async(req, res, next) => {
  let reqRes;

  try {
    console.log("ACA");
    reqRes = await axios.get(URL + '/' + req.id);
  } catch (err) {
    msErrorHandler(err);
  }

  res.status(200).json(reqRes.data);
};

exports.post = async(req, res, next) => {
  let reqRes;
  try {
    reqRes = await axios.post(URL, {
      id: req.id,
      ... req.body
    });
  } catch (err) {
    msErrorHandler(err);
  }

  res.status(200).json(reqRes.data);
};
