'use strict'

const axios = require('axios');
const { pick, getQueryString, toQueryString } = require('../utils/util')
const { services }  = require('../config')

const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

const publicStates = [
  'funding',
  'canceled',
  'in_progress',
  'completed'
]

const publicAttributes = [
  'ownerid',
  'id',
  'title',
  'description',
  'type',
  'state',
  'actualstage',
  'stages',
  'creationdate',
  'location',
  'tags',
  'multimedia',
  'fundedamount',
  'totalamount',
  'sponsorscount',
  'favouritescount'
]

exports.search = async(req, res, next) => {

  let state = []

  if (req.query.state == 'on_review'){
    throw ApiError.badRequest(errMsg.WRONG_STATE)
  } else if (req.query.state instanceof Array){
    state = req.query.state.filter(elem => elem != 'on_review')
  } else if (publicStates.includes(req.query.state)){
    state.push(req.query.state)
  } else {
    state = publicStates
  }

  req.query = {
    ...req.query,
    state
  }

  const query = toQueryString(req.query)
  const reqRes = await axios.get(services.projects + '/search' + query);

  res.status(200).json(reqRes.data);
};

exports.view = async(req, res, next) => {
  const projectid = req.params.id
  let reqRes = await axios.get(services.projects + '/' + projectid);
  const response = reqRes.data
  if (req.id != response.data.ownerid){
    response.data = pick(response.data, publicAttributes)
  }

  const query = 'projectid=' + projectid + '&userid=' + req.id
  reqRes = await axios.get(services.sponsors + '/favourites?' + query);

  response.data.isfavourite = reqRes.data.data.length > 0

  res.status(200).json(response);
};

exports.create = async(req, res, next) => {

  const reqRes = await axios.post(services.projects, {
    ownerid: req.id,
    ... req.body
  });

  const stages = req.body.stages.map((data) => data.amount);

  await axios.post(services.payments + '/projects', {
   ownerid: req.id,
   projectid: reqRes.data.data.id,
   stages,
  });

  res.status(201).json(reqRes.data);
}

exports.update = async(req, res, next) => {
  const auxRes = await axios.get(services.projects + '/' + req.params.id);
  const response = auxRes.data
  if (response.data.ownerid != req.id){
    throw ApiError.notAuthorized(errMsg.EDIT_PROJECT_PERMISSIONS)
  }
  const reqRes = await axios.patch(services.projects + '/' + req.params.id, req.body);

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

  reqRes = await axios.get(services.projects + '/search' + query);

  return res.status(200).json(reqRes.data);
}

exports.getUserProjects = async(req, res, next) => {
  return getUserProjectsAux(req, res, req.params.id)
}

exports.getMyProjects = async(req, res, next) => {
  return getUserProjectsAux(req, res, req.id)
}

exports.adminListProjects = async(req, res, next) => {

  const query = getQueryString(req.originalUrl)
  const reqRes = await axios.get(services.projects + '/search' + query);

  res.status(200).json(reqRes.data);
};


exports.adminGetProject = async(req, res, next) => {

  let reqRes = await axios.get(services.projects + '/' + req.params.projectid);
  const response = reqRes.data

  const query = 'projectid=' + req.params.projectid + '&userid=' + req.id
  reqRes = await axios.get(services.sponsors + '/favourites?' + query);

  response.data.isfavourite = reqRes.data.data.length > 0

  res.status(200).json(response);
};
