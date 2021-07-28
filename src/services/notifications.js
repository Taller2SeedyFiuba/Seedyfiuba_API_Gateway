'use strict'

const axios = require('axios');
const { services }  = require('../config')
const { ApiError } = require('../errors/ApiError');
const errMsg = require('../errors/messages')

const stateTranslate = function(state){
  switch (state){
    case 'in_progress':
      return 'En progreso'
    case 'on_review':
      return 'En revision'
    case 'completed':
      return 'Completado'
    case 'funding':
      return 'En financiamiento'
    case 'canceled':
      return 'Cancelado'
  }
}


exports.sendNewStageCompleted = async({id, title, stage}) => {

  const data = {
    title: "Novedades en proyectos",
    body: `El proyecto '${title}' ha completado la etapa numero ${stage}`,
    projectid: id,
  }

  return await this.sendProjectNotification(data);
}

exports.sendNewState = async({id, title, state}) => {

  const data = {
    title: "Novedades en proyectos",
    body: `El proyecto '${title}' ha sido promovido al estado '${stateTranslate(state)}'`,
    projectid: id
  }

  return await this.sendProjectNotification(data);
}

exports.sendNewViewer = async({id, title}) => {

  const data = {
    title: "Novedades en proyectos",
    body: `El proyecto '${title}' ha recibido un nuevo veedor`,
    projectid: id
  }

  return await this.sendProjectNotification(data);
}


exports.sendProjectNotification = async(data) => {
  return await axios.post(services.notifications + '/notifications/projects', data)
}

exports.sendNotification = async(data) => {
  return await axios.post(services.notifications + '/notifications', data)
}
