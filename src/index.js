const { createApp } = require("./app");
const { port, env } = require('./config')
const { logError, logDebug }  = require('./utils/log')


const main = async function(){
  const app = createApp();

  app.listen(port, () => {
    logDebug(`Servidor escuchando en http://localhost:${port}`);
    logDebug(`Corriendo en modo: ${env}`);
  });
}

main()
  .catch(err => {
    logError(err.message)
  });

