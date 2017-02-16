const mongoose = require('mongoose');
const nconf = require('nconf');
const glob = require('glob');

mongoose.connect(nconf.get('mongodb'));

glob.sync('./models/*').forEach((item) => {
  /* eslint-disable global-require, import/no-dynamic-require */
  require(item);
});
