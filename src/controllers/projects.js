
'use strict'

const axios = require('axios');
const URL = 'https://seedyfiuba-back-projects.herokuapp.com/api';

const { msErrorHandler } = require('../errors/handler');

exports.search = async(req, res, next) => {
  let reqRes;
  let query = ''
  try {
    const idx = req.originalUrl.indexOf('?')
    if (idx != -1) query = req.originalUrl.substring(idx)
    reqRes = await axios.get(URL + '/search' + query);
  } catch (err) {
    msErrorHandler(err);
  }

  res.status(200).json(reqRes.data);
};

exports.view = async(req, res, next) => {
    let reqRes;
    try {
      reqRes = await axios.get(URL + '/view/' + req.params.id);
    } catch (err) {
      msErrorHandler(err);
    }
  
    res.status(200).json(reqRes.data);
  };


exports.create = async(req, res, next) => {
  let reqRes;
  try {
    reqRes = await axios.post(URL, {
      ownerid: req.id,
      ... req.body
    });
  } catch (err) {
    msErrorHandler(err);
  }

  res.status(200).json(reqRes.data);
}


exports.update = async(req, res, next) => {
  let reqRes;
  try {
    reqRes = await axios.put(URL + '/' + req.params.id, req.body);
  } catch (err) {
    msErrorHandler(err);
  }

  res.status(200).json(reqRes.data);
}
