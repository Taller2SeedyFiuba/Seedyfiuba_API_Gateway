
'use strict'

const axios = require('axios');
const URL = 'https://seedyfiuba-back-projects.herokuapp.com/api';

const { msErrorHandler } = require('../errors/handler');

exports.search = async(req, res, next) => {
  let reqRes;
  try {
    const query = req.originalUrl.substring(req.originalUrl.indexOf('?'))
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
