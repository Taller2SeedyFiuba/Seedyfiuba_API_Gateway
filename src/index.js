const { start } = require("./app");
const PORT = process.env.PORT || 8080;

function main() {
  const app = start();

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
    console.log('ENV: ', process.env.ENV);
  });
}

main()

