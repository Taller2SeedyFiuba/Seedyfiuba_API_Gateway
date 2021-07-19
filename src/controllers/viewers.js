'use strict'

const axios = require('axios');
const SPONSORS_URL = process.env.SPONSORS_MS;
const PROJECTS_URL = process.env.PROJECTS_MS
const PAYMENT_URL = process.env.PAYMENT_GTW_MS;


const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

exports.subscribeToViewing = async(req, res, next) => {
  const bodyViewers = {
    userid: req.id
  }
  const response = await axios.post(SPONSORS_URL + '/viewers', bodyViewers);

  //Aca falta agregar un patch al servicio de usuarios, que modifique el campo "isviewer"

  res.status(201).json(response.data);
};

exports.addProject = async(req, res, next) => {
  const { projectid } = req.params;
  let projectResponse;
  try {
    projectResponse = await axios.get(PROJECTS_URL + '/' + projectid)

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
  const resp = await axios.post(PAYMENT_URL + '/projects/' + projectid + '/viewers', {
    ownerid: req.id,
  });

  const sponsorsResponse = await axios.post(SPONSORS_URL + '/viewers/' + req.id + '/projects', bodyFavourites);

  /** If project reaches 3 reviewers we change the state */
  const projectData = resp.data.data;
  if (projectData.state === 'funding') {
    await axios.patch(PROJECTS_URL + '/' + projectid, {
      state: 'funding'
    });
  }

  res.status(201).json(sponsorsResponse.data);
};

exports.getMyReviews = async(req, res, next) => {
  const sponsorsQuery = "userid=" + req.id
                      + "&limit=" + (req.query.limit || 10)
                      + "&page=" + (req.query.page || 1)

  let sponsorsResponse = await axios.get(SPONSORS_URL + '/viewers/' + req.id);
  if (sponsorsResponse.data.data == false){
    throw ApiError.notAuthorized("user-is-not-viewer")
  }

  sponsorsResponse = await axios.get(SPONSORS_URL + '/viewers?' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0){
    return res.status(200).json(sponsorsResponse.data);
  }

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"
  const projectsResponse = await axios.get(PROJECTS_URL + '/search?' + projectsQuery);

  res.status(200).json(projectsResponse.data);
};

exports.getProjectsOnReview = async(req, res, next) => {
  const sponsorsResponse = await axios.get(SPONSORS_URL + '/viewers/' + req.id);
  if (sponsorsResponse.data.data == false){
    throw ApiError.notAuthorized(errMsg.USER_NOT_VIEWER)
  }
  const query = "state=on_review"
              + "&limit=" + (req.query.limit || 10)
              + "&page="  + (req.query.page  || 1)

  const response = await axios.get(PROJECTS_URL + '/search?' + query);

  res.status(200).json(response.data);
};


exports.voteProject = async(req, res, next) => {
  const { projectid } = req.params;

  let projectResponse;
  try {
    projectResponse = await axios.get(PROJECTS_URL + '/' + projectid)
  } catch (err) {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.error)
    } else { throw err }
  }

  //const project = projectResponse.data.data;
  const { state, actualstage } = projectResponse.data.data

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

  const sponsorsResponse = await axios.post(SPONSORS_URL + '/viewers/' + req.id + '/vote', sponsorsBody);
  const resp = await axios.post(PAYMENT_URL + '/projects/' + projectid + '/viewers/' + req.id + '/votes', {
    'completedStage': actualstage
  });

  /** If project reaches 3 votes we change the stage or state */
  const projectData = resp.data.data;

  console.log(projectData)

  if (projectData.currentStage != actualstage || projectData.state != state) {
    await axios.patch(PROJECTS_URL + '/' + projectid, {
      state: projectData.state,
      actualstage: Number(projectData.currentStage)
    });
  }

  res.status(201).json(sponsorsResponse.data);
};
