'use strict'

const axios = require('axios');
const { pick } = require('../util/util')
const URL = process.env.PROJECTS_MS;

const { ApiError } = require('../errors/ApiError');

const publicAttributes = [  
  'ownerid',
  'id',
  'title', 
  'description',
  'type',
  'stage',
  'creationdate',
  'finishdate',
  'sponsorshipagreement',
  'seeragreement',
  'location' 
]

exports.search = async(req, res, next) => {
  let reqRes;
  let query = ''
  const idx = req.originalUrl.indexOf('?')
  if (idx != -1) query = req.originalUrl.substring(idx)
  reqRes = await axios.get(URL + '/search' + query);

  res.status(200).json(reqRes.data);
};

exports.view = async(req, res, next) => {
  const reqRes = await axios.get(URL + '/view/' + req.params.id);
  const response = reqRes.data
  if (req.id != response.data.ownerid){
    response.data = pick(response.data, publicAttributes)
  }
  res.status(200).json(response);
};

exports.create = async(req, res, next) => {
  const reqRes = await axios.post(URL, {
      ownerid: req.id,
      ... req.body
    });

  res.status(200).json(reqRes.data);
}

exports.update = async(req, res, next) => {
  const auxRes = await axios.get(URL + '/view/' + req.params.id);
  const response = auxRes.data
  if (response.data.ownerid != req.id){
    throw ApiError.notAuthorized("You don't have permissions to update the project")
  }
  const reqRes = await axios.put(URL + '/' + req.params.id, req.body);

  res.status(200).json(reqRes.data);
}

exports.destroy = async(req, res, next) => {
  const auxRes = await axios.get(URL + '/view/' + req.params.id);
  const response = auxRes.data
  if (response.data.ownerid != req.id){
    throw ApiError.notAuthorized("You don't have permissions to delete the project")
  }
  const reqRes = await axios.delete(URL + '/' + req.params.id);

  res.status(200).json(reqRes.data);
}

const getUserProjectsAux = async(req, res, id) => {
  let reqRes;
  let query = ''
  const idx = req.originalUrl.indexOf('?')
  if (idx != -1){
    query = req.originalUrl.substring(idx)
    query = query.concat('&ownerid=' + id)
  }else{
    query = query.concat('?ownerid=' + id)
  }
  reqRes = await axios.get(URL + '/search' + query);

  return res.status(200).json(reqRes.data);
}

exports.getUserProjects = async(req, res, next) => {
  return getUserProjectsAux(req, res, req.params.id)
}

exports.getMyProjects = async(req, res, next) => {
  return getUserProjectsAux(req, res, req.id)
}