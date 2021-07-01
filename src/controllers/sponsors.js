'use strict'

const axios = require('axios');
const SPONSORS_URL = process.env.SPONSORS_MS;
const PROJECTS_URL = process.env.PROJECTS_MS

const { ApiError } = require('../errors/ApiError');

exports.addSponsor = async(req, res, next) => {
  const { projectid } = req.params
  let { amount } = req.body
  //Estos chequeos son necesarios antes de la block
  const projectResponse = await axios.get(PROJECTS_URL + '/' + projectid).
  catch(err => {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  })

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest("owner-cant-sponsor");
  //Chequeo de estado, por ahora no lo tenemos en cuenta
  //if (state != 'funding'){
  //  if (state == 'on_review') throw ApiError.badRequest("Project not found")
  //  throw ApiError.badRequest("Project is not in funding state")
  //}

  //Aca deberia ir el llamado al endpoint de payments el cual va a recibir un amount a aportar.



  //Necesitamos como respuesta de la llamada la cantidad de dinero que efectivamente se aporto

  const bodySponsors = {
    userid: req.id,
    projectid
  }
  const sponsorsResponse = await axios.post(SPONSORS_URL + '/sponsors', bodySponsors);

  const bodyProjects = {
    sponsorscount: sponsorsResponse.data.data.newsponsor ? 1 : undefined,
    fundedamount: amount
  }
  //Si esto de aca llega a fallar queda un sponsor fantasma cargado en el servicio de sponsors
  await axios.patch(PROJECTS_URL + '/' + projectid, bodyProjects);

  res.status(201).json({
    status: 'success',
    data: {
      userid: req.id,
      projectid,
      amount
    }
  });
};

exports.getMySponsors = async(req, res, next) => {
  const sponsorsQuery = "userid=" + req.id
                      + "&limit=" + (req.query.limit || 10)
                      + "&page=" + (req.query.page || 1)

  const sponsorsResponse = await axios.get(SPONSORS_URL + '/sponsors?' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    return res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"

  const projectsResponse = await axios.get(PROJECTS_URL + '/search?' + projectsQuery);

  res.status(200).json(projectsResponse.data);
};

exports.addFavourite = async(req, res, next) => {
  const { projectid } = req.params
  const projectResponse = await axios.get(PROJECTS_URL + '/' + projectid).
  catch(err => {
    if (err.response && err.response.status == ApiError.codes.notFound){
      throw ApiError.badRequest(err.response.data.message)
    } else { throw err }
  })

  const { ownerid, state } = projectResponse.data.data
  if (ownerid == req.id)
    throw ApiError.badRequest("owner-cant-favourite");
  //Por ahora no las tenemos en cuenta
  //if (state != 'funding'){
  //  if (state == 'on_review') throw ApiError.badRequest("Project not found")
  //  throw ApiError.badRequest("Project is not in funding state")
  //}

  const bodyFavourites = {
    userid: req.id,
    projectid
  }
  const favouritesResponse = await axios.post(SPONSORS_URL + '/favourites', bodyFavourites);

  const bodyProjects = {
    favouritescount: 1
  }
  //Idem a sponsors, si se llega aca y falla queda un fav fantasma cargado.
  await axios.patch(PROJECTS_URL + '/' + projectid, bodyProjects);

  res.status(201).json(favouritesResponse.data);
};

exports.getMyFavourites = async(req, res, next) => {
  const sponsorsQuery = "userid=" + req.id
                      + "&limit=" + (req.query.limit || 10)
                      + "&page=" + (req.query.page || 1)

  const sponsorsResponse = await axios.get(SPONSORS_URL + '/favourites?' + sponsorsQuery);
  if (sponsorsResponse.data.data.length == 0)
    res.status(200).json(sponsorsResponse.data);

  let projectsQuery = sponsorsResponse.data.data.map(elem => { return 'id='+elem.projectid }).join('&')
  projectsQuery += "&limit=" + (req.query.limit || 10)  + "&page=1"
  const projectsResponse = await axios.get(PROJECTS_URL + '/search?' + projectsQuery);

  res.status(200).json(projectsResponse.data);
};
