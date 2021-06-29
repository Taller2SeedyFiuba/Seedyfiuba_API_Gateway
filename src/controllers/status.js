'use strict'

const axios = require('axios');
const PROJECTS_URL = process.env.PROJECTS_MS;
const USERS_URL = process.env.USERS_MS;
const SPONSORS_URL = process.env.SPONSORS_MS;
const PAYMENTS_URL = process.env.PAYMENT_GTW_MS;

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

  await axios.get(USERS_URL + '/status').
  catch(err => {
    responses.users = "ERROR"
  })

  await axios.get(PROJECTS_URL + '/status').
  catch(err => {
    responses.projects = "ERROR"
  })

  await axios.get(SPONSORS_URL + '/status').
  catch(err => {
    responses.sponsors = "ERROR"
  })

  await axios.get(PAYMENTS_URL + '/status').
  catch(err => {
    responses.sponsors = "ERROR"
  })

  return res.status(200).json({
    "status": "success",
    "data": responses
  });
}


module.exports = { getStatus }