const { start } = require("./app");
const PORT = process.env.PORT || 8080;

function main() {
  let app;

  try {
    app = start();
  } catch (err) {
    console.log(err);
    process.exit();
  }


  app.listen(PORT, () => {
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
    console.log('ENV: ', process.env.ENV);
  });
}

main()

