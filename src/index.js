const server = require('./app.js');
const { connDB } = require('./db.js');
require('dotenv').config();
const {
  PORT
} = process.env;

// Syncing all the models at once. //force: true //Problema con tabla de Dietas que se borra continuamente //alter: true
connDB.sync({ alter: true }).then(() => {
  console.log('DB connected');
  server.listen(PORT, () => {
    console.log(`Express run at port ${PORT}`); // eslint-disable-line no-console
  });
});
