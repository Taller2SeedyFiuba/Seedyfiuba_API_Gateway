'use strict'

const axios = require('axios');
const { services } = require('../config')
const { toQueryString } = require('../utils/util')
const { ApiError } = require('../errors/ApiError');
const notifications = require('../services/notifications')
const errMsg = require('../errors/messages')

exports.subscribeToViewing = async(req, res, next) => {
  const bodyViewers = {
    userid: req.id
  }
  const response = await axios.post(services.sponsors + '/viewers', bodyViewers);

  res.status(201).json(response.data);
};

exports.addProject = async(req, res, next) => {
  const { projectid } = req.params;
  let projectResponse;
  try {
    projectResponse = await axios.get(services.projects + '/' + projectid)

  } catch (err) {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.error)
    } else { throw err }
  }

  const project = projectResponse.data.data;
  if (project.state != 'on_review'){
    throw ApiError.badRequest(errMsg.PROJECT_NOT_ON_REVIEW)
  }

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id){
    throw ApiError.badRequest(errMsg.OWNER_CANT_REVIEW);
  }

  const bodyFavourites = {
    projectid
  }
  const resp = await axios.post(services.payments + '/projects/' + projectid + '/viewers', {
    ownerid: req.id,
  });

  const sponsorsResponse = await axios.post(services.sponsors + '/viewers/' + req.id + '/projects', bodyFavourites);

  await notifications.sendNewViewer({ id: project.id, title: project.title });

  /** If project reaches 3 reviewers we change the state */
  const projectData = resp.data.data;
  if (projectData.state === 'funding') {
    await axios.patch(services.projects + '/' + projectid, {
      state: 'funding'
    });
    await notifications.sendNewState({
      id: project.id,
      title: project.title,
      state: projectData.state
    })
  }

  res.status(201).json(sponsorsResponse.data);
};

exports.getMyReviews = async(req, res, next) => {

  req.query = {
    ...req.query,
    limit: (req.query.limit || 10),
    page: (req.query.page || 1),
    userid: req.id
  }

  const sponsorsQuery = toQueryString(req.query)

  let sponsorsResponse = await axios.get(services.sponsors + '/viewers/' + req.id);
  if (sponsorsResponse.data.data == false){
    throw ApiError.notAuthorized("user-is-not-viewer")
  }

  sponsorsResponse = await axios.get(services.sponsors + '/viewers' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0){
    return res.status(200).json(sponsorsResponse.data);
  }

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"
  const projectsResponse = await axios.get(services.projects + '/search?' + projectsQuery);

  res.status(200).json(projectsResponse.data);
};

exports.getProjectsOnReview = async(req, res, next) => {
  const sponsorsResponse = await axios.get(services.sponsors + '/viewers/' + req.id);
  if (sponsorsResponse.data.data == false){
    throw ApiError.notAuthorized(errMsg.USER_NOT_VIEWER)
  }
  const query = "state=on_review"
              + "&limit=" + (req.query.limit || 10)
              + "&page="  + (req.query.page  || 1)

  const response = await axios.get(services.projects + '/search?' + query);

  res.status(200).json(response.data);
};


exports.voteProject = async(req, res, next) => {
  const { projectid } = req.params;

  let projectResponse;
  try {
    projectResponse = await axios.get(services.projects + '/' + projectid)
  } catch (err) {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.error)
    } else { throw err }
  }

  //const project = projectResponse.data.data;
  const { id, title, state, actualstage } = projectResponse.data.data

  if (state != 'in_progress'){
    throw ApiError.badRequest(errMsg.PROJECT_NOT_IN_PROGRESS)
  }

  if ((req.body.stage == undefined) || (req.body.stage != actualstage)){
    throw ApiError.badRequest(errMsg.WRONG_STAGE);
  }

  const sponsorsBody = {
    projectid,
    stage: req.body.stage
  }

  const sponsorsResponse = await axios.post(services.sponsors + '/viewers/' + req.id + '/vote', sponsorsBody);
  const resp = await axios.post(services.payments + '/projects/' + projectid + '/viewers/' + req.id + '/votes', {
    'completedStage': actualstage
  });

  /** If project reaches 3 votes we change the stage or state */
  const projectData = resp.data.data;

  if (projectData.currentStage != actualstage || projectData.state != state) {
    await axios.patch(services.projects + '/' + projectid, {
      state: projectData.state,
      actualstage: Number(projectData.currentStage)
    });

    if (projectData.currentStage != actualstage){
      await notifications.sendNewStageCompleted({
        id,
        title,
        stage: actualstage + 1
      })
    }
    if (projectData.state != state){
      await notifications.sendNewState({
        id,
        title,
        state: projectData.state
      })
    }
  }

  res.status(201).json(sponsorsResponse.data);
};
