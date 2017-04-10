var Pool = require('pg').Pool;
var config = require('./config.js');
var pool = new Pool(config);

module.exports = function (context, event) {
  context.log(context.bindingData);
  context.log(event);

  pool.connect()
    .then((client) => {
      client.query('INSERT INTO events(event) VALUES($1)', [JSON.stringify(event)])
        .then((res) => {
          context.log('Successfully inserted');
          client.release();
          context.done();
        })
        .catch((err) => {
          client.release();
          context.log(err);
          context.done();
        });
    })
    .catch((err) => {
      context.log(err);
      context.done();
    });
};
