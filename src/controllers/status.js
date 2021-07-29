'use strict'

const axios = require('axios');
const { services }  = require('../config')

const { ApiError } = require('../errors/ApiError');

const getStatus = async (req, res, next) => {

  const responses = {
    users: "OK",
    projects: "OK",
    sponsors: "OK",
    payments: "OK",
    notifications: "OK"
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

  await axios.get(services.notifications + '/status').
  catch(err => {
    console.log(`Couldn't connect to ${services.notifications}`)
    responses.notifications = "ERROR"
  })

  return res.status(200).json({
    "status": "success",
    "data": responses
  });
}


module.exports = { getStatus }
