const response =  {
  title: "Novedades en proyectos",
  body: `El proyecto 'Un titulo' ha completado la etapa numero 1`,
  projectid: 5,
  succeded: ['userid1', 'userid2', 'userid3'],
  failed: ['userid4', 'userid5']
};


exports.sendNewStageCompleted = async({id, title, stage}) => {
  return response
}

exports.sendNewState = async({id, title, state}) => {
  return response
}

exports.sendNewViewer = async({id, title}) => {
  return response
}


exports.sendProjectNotification = async(data) => {
  return response
}

exports.sendNotification = async(data) => {
  return response
}
