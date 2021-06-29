'use strict'

const axios = require('axios');
const { pick, getQueryString } = require('../util/util')
const PROJECTS_URL = process.env.PROJECTS_MS;
const SPONSORS_URL = process.env.SPONSORS_MS;

const { ApiError } = require('../errors/ApiError');

const publicAttributes = [  
  'ownerid',
  'id',
  'title', 
  'description',
  'type',
  'state',
  'stages',
  'creationdate',
  'location',
  'tags',
  'multimedia',
  'fundingamount',
  'totalamount',
  'sponsorscount',
  'favouritescount'
]

exports.search = async(req, res, next) => {

  const query = getQueryString(req.originalUrl)
  //Aca falta filtrar los proyectos cancelados o en estado on_review
  const reqRes = await axios.get(PROJECTS_URL + '/search' + query);

  res.status(200).json(reqRes.data);
};

exports.view = async(req, res, next) => {
  const projectid = req.params.id
  let reqRes = await axios.get(PROJECTS_URL + '/' + projectid);
  const response = reqRes.data
  if (req.id != response.data.ownerid){
    response.data = pick(response.data, publicAttributes)
  }

  const query = 'projectid=' + projectid + '&userid=' + req.id
  reqRes = await axios.get(SPONSORS_URL + '/favourites?' + query);

  response.data.isfavourite = reqRes.data.data.length > 0

  res.status(200).json(response);
};

exports.create = async(req, res, next) => {
  const reqRes = await axios.post(PROJECTS_URL, {
      ownerid: req.id,
      ... req.body
    });

  res.status(201).json(reqRes.data);
}

exports.update = async(req, res, next) => {
  const auxRes = await axios.get(PROJECTS_URL + '/' + req.params.id);
  const response = auxRes.data
  if (response.data.ownerid != req.id){
    throw ApiError.notAuthorized("edition-permissions")
  }
  const reqRes = await axios.patch(PROJECTS_URL + '/' + req.params.id, req.body);

  res.status(200).json(reqRes.data);
}
/*  TIENE SENTIDO ELIMINAR UN PROYECTO?
exports.destroy = async(req, res, next) => {
  const auxRes = await axios.get(PROJECTS_URL + '/' + req.params.id);
  const response = auxRes.data
  if (response.data.ownerid != req.id){
    throw ApiError.notAuthorized("You don't have permissions to delete the project")
  }
  const reqRes = await axios.delete(PROJECTS_URL + '/' + req.params.id);

  res.status(200).json(reqRes.data);
}
*/
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
  
  reqRes = await axios.get(PROJECTS_URL + '/search' + query);

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
  const reqRes = await axios.get(PROJECTS_URL + '/search' + query);

  res.status(200).json(reqRes.data);
};


exports.adminGetProject = async(req, res, next) => {

  let reqRes = await axios.get(PROJECTS_URL + '/' + req.params.projectid);
  const response = reqRes.data

  const query = 'projectid=' + projectid + '&userid=' + req.id
  reqRes = await axios.get(SPONSORS_URL + '/favourites?' + query);

  response.data.isfavourite = reqRes.data.data.length > 0

  res.status(200).json(response);
};
