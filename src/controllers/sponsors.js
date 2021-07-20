'use strict'

const axios = require('axios');
const { services }  = require('../config')

const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

exports.addSponsor = async(req, res, next) => {
  const { projectid } = req.params
  let { amount } = req.body
  //Estos chequeos son necesarios antes de la block
  const projectResponse = await axios.get(services.projects + '/' + projectid).
  catch(err => {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  })

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest(errMsg.OWNER_CANT_SPONSOR);

  //Chequeo de estado, por ahora no lo tenemos en cuenta
  if (state != 'funding'){
    throw ApiError.badRequest(errMsg.PROJECT_NOT_ON_FUNDING)
  }

  //Aca deberia ir el llamado al endpoint de payments el cual va a recibir un amount a aportar.
  const resp = await axios.post(services.payments + '/projects/' + projectid + '/transactions', {
    ownerid: req.id,
    amount,
  });


  //Necesitamos como respuesta de la llamada la cantidad de dinero que efectivamente se aporto

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
  //Si esto de aca llega a fallar queda un sponsor fantasma cargado en el servicio de sponsors
  await axios.patch(services.projects + '/' + projectid, bodyProjects);

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
  const sponsorsQuery = "userid=" + req.id
                      + "&limit=" + (req.query.limit || 10)
                      + "&page=" + (req.query.page || 1)

  const sponsorsResponse = await axios.get(services.sponsors + '/sponsors?' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    return res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"

  const projectsResponse = await axios.get(services.projects + '/search?' + projectsQuery);

  return res.status(200).json(projectsResponse.data);
};

exports.addFavourite = async(req, res, next) => {
  const { projectid } = req.params
  const projectResponse = await axios.get(services.projects + '/' + projectid).
  catch(err => {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  })

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest(errMsg.OWNER_CANT_FAVOURITE);
  //Por ahora no las tenemos en cuenta
  //if (state != 'funding'){
  //  if (state == 'on_review') throw ApiError.badRequest(errMsg.PROJECT_NOT_FOUND)
  //  throw ApiError.badRequest(errMsg.PROJECT_NOT_ON_FUNDING)
  //}

  const bodyFavourites = {
    userid: req.id,
    projectid
  }
  const favouritesResponse = await axios.post(services.sponsors + '/favourites', bodyFavourites);

  const bodyProjects = {
    favouritescount: 1
  }
  //Idem a sponsors, si se llega aca y falla queda un fav fantasma cargado.
  await axios.patch(services.projects + '/' + projectid, bodyProjects);

  return res.status(201).json(favouritesResponse.data);
};

exports.getMyFavourites = async(req, res, next) => {
  const sponsorsQuery = "userid=" + req.id
                      + "&limit=" + (req.query.limit || 10)
                      + "&page=" + (req.query.page || 1)

  const sponsorsResponse = await axios.get(services.sponsors + '/favourites?' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    return res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"
  const projectsResponse = await axios.get(services.projects + '/search?' + projectsQuery);

  return res.status(200).json(projectsResponse.data);
};
