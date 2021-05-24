'use strict'

const axios = require('axios');
const URL = 'https://seedyfiuba-back-users.herokuapp.com/api';
const { hocError } = require('../errors/errorHandler');

exports.get = async(req, res, next) => {
  res.status(200).send({});
}

exports.me = hocError(async(req, res, next) => {
  const response = await axios.get(URL + '/' + req.id);
  console.log(response.data);
  res.status(200).send(response.data);
});

exports.getById = async(req, res, next) => {
  res.status(200).send(data);
}

exports.post = hocError(async(req, res, next) => {
  try {
    await axios.post(URL, {
      id: req.id,
      ... req.body
    });
    
  } catch (error) {
    console.log(error);
  }

  res.status(200).send({message: 'User created'});
});