var index = require('./index.js');

var Pool = require('pg').Pool;
var config = require('./config.js');
var pool = new Pool(config);

var dummyBindingData = {
  partitionContext: 'Microsoft.ServiceBus.Messaging.PartitionContext',
  filename: '1492063044553.txt',
  status: 'start',
  invocationId: '009bf787-d183-4e4c-9938-83ffac95e880'
};

var dummyEvent = { filename: '1492063044553.txt', status: 'start' };

pool
  .query('CREATE TABLE IF NOT EXISTS events (event text)')
  .then(function () {
    index({
      done: function () {
        process.exit(0);
      },
      log: console.log,
      bindingData: dummyBindingData
    }, dummyEvent);
  });
