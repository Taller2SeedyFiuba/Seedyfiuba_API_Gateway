'use strict'

const axios = require('axios');
const SPONSORS_URL = process.env.SPONSORS_MS;
const PROJECTS_URL = process.env.PROJECTS_MS

const { ApiError } = require('../errors/ApiError');

exports.subscribeToViewing = async(req, res, next) => {
  const bodyViewers = { 
    userid: req.id
  }
  const response = await axios.post(SPONSORS_URL + '/viewers', bodyViewers);

  //Aca falta agregar un patch al servicio de usuarios, que modifique el campo "isviewer"

  res.status(201).json(response.data);
};

exports.addProject = async(req, res, next) => {
  const { projectid } = req.params
  const projectResponse = await axios.get(PROJECTS_URL + '/' + projectid).
  catch(err => {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.error)
    } else { throw err }
  })
  const project = projectResponse.data.data
  if (project.state != 'on_review'){
    throw ApiError.badRequest('project-not-on-review')
  }

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id){
    throw ApiError.badRequest(`owner-cant-review`);
  }
    
  //Por ahora no las tenemos en cuenta
  //if (state != 'funding'){
  //  if (state == 'on_review') throw ApiError.badRequest("Project not found")
  //  throw ApiError.badRequest("Project is not in funding state")
  //}

  const bodyFavourites = {
    projectid
  }
  const sponsorsResponse = await axios.post(SPONSORS_URL + '/viewers/' + req.id + '/projects', bodyFavourites);
  
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
    throw ApiError.notAuthorized("user-is-not-viewer")
  }
  const query = "state=on_review"
              + "&limit=" + (req.query.limit || 10)
              + "&page="  + (req.query.page  || 1)
  
  const response = await axios.get(PROJECTS_URL + '/search?' + query);

  res.status(200).json(response.data);
};