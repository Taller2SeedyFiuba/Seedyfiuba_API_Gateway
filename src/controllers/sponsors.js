'use strict'

const axios = require('axios');
const { services }  = require('../config')
const { toQueryString } = require('../utils/util')
const { ApiError } = require('../errors/ApiError');
const notifications = require('../services/notifications')
const errMsg = require('../errors/messages')

exports.addSponsor = async(req, res, next) => {
  const { projectid } = req.params
  let { amount } = req.body

  let projectResponse = 0;
  try {
    projectResponse = await axios.get(services.projects + '/' + projectid)
  }catch(err){
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  }

  const { ownerid, state, title } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest(errMsg.OWNER_CANT_SPONSOR);

  if (state != 'funding'){
    throw ApiError.badRequest(errMsg.PROJECT_NOT_ON_FUNDING)
  }

  const resp = await axios.post(services.payments + '/projects/' + projectid + '/transactions', {
    ownerid: req.id,
    amount,
  });

  const bodySponsors = {
    userid: req.id,
    projectid
  }

  const sponsorsResponse = await axios.post(services.sponsors + '/sponsors', bodySponsors);
  const bodyProjects = {
    sponsorscount: sponsorsResponse.data.data.newsponsor ? 1 : undefined,
    missingamount: resp.data.data.missingAmount,
    state: resp.data.data.state,
  }

  await axios.patch(services.projects + '/' + projectid, bodyProjects);

  if (resp.data.data.state != state){
    await notifications.sendNewState({id: projectid, title, state: resp.data.data.state});
  }

  res.status(201).json({
    status: 'success',
    data: {
      userid: req.id,
      projectid,
      amount: resp.data.data.amount
    }
  });
};

exports.getMySponsors = async(req, res, next) => {

  req.query = {
    ...req.query,
    limit: (req.query.limit || 10),
    page: (req.query.page || 1),
    userid: req.id
  }

  const sponsorsQuery = toQueryString(req.query)

  const sponsorsResponse = await axios.get(services.sponsors + '/sponsors' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    return res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"

  const projectsResponse = await axios.get(services.projects + '/search?' + projectsQuery);

  return res.status(200).json(projectsResponse.data);
};

exports.addFavourite = async(req, res, next) => {
  const { projectid } = req.params
  let projectResponse = 0;
  try {
    projectResponse = await axios.get(services.projects + '/' + projectid)
  }catch(err){
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  }

  const { ownerid } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest(errMsg.OWNER_CANT_FAVOURITE);

  const bodyFavourites = {
    userid: req.id,
    projectid
  }
  const favouritesResponse = await axios.post(services.sponsors + '/favourites', bodyFavourites);

  const bodyProjects = {
    favouritescount: 1
  }

  await axios.patch(services.projects + '/' + projectid, bodyProjects);

  return res.status(201).json(favouritesResponse.data);
};

exports.getMyFavourites = async(req, res, next) => {
  req.query = {
    ...req.query,
    limit: (req.query.limit || 10),
    page: (req.query.page || 1),
    userid: req.id
  }
  const sponsorsQuery = toQueryString(req.query)

  const sponsorsResponse = await axios.get(services.sponsors + '/favourites' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    return res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"
  const projectsResponse = await axios.get(services.projects + '/search?' + projectsQuery);

  return res.status(200).json(projectsResponse.data);
};


exports.deleteFavourite = async(req, res, next) => {

  const { projectid } = req.params

  const uri = `/users/${req.id}/projects/${projectid}`

  const favouritesResponse = await axios.delete(services.sponsors + '/favourites/' + uri);

  const bodyProjects = {
    favouritescount: -1
  }

  await axios.patch(services.projects + '/' + projectid, bodyProjects);

  return res.status(200).json(favouritesResponse.data);
};


