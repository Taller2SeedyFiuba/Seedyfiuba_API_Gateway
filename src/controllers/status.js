'use strict'

const axios = require('axios');
const { services }  = require('../config')

const { ApiError } = require('../errors/ApiError');

const getStatus = async (req, res, next) => {

  //NOTA: Me encantaria modularizar esto dentro de un for por cada servicio, pero
  //estuve teniendo problemas con async await. Por mas que la llamada fallase no me
  //cambiaba el estado de "OK" a "ERROR"

  //const services = {
  //  users: USERS_URL,
  //  projects: PROJECTS_URL,
  //  sponsors: SPONSORS_URL
  //}
  const responses = {
    users: "OK",
    projects: "OK",
    sponsors: "OK",
    payments: "OK"
  }

  await axios.get(services.users + '/status').
  catch(err => {
    responses.users = "ERROR"
  })

  await axios.get(services.projects + '/status').
  catch(err => {
    responses.projects = "ERROR"
  })

  await axios.get(services.sponsors + '/status').
  catch(err => {
    responses.sponsors = "ERROR"
  })

  await axios.get(services.payments + '/status').
  catch(err => {
    responses.payments = "ERROR"
  })

  return res.status(200).json({
    "status": "success",
    "data": responses
  });
}


module.exports = { getStatus }
