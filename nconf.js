const nconf = require('nconf');

nconf.argv().env();
const env = process.env.NODE_ENV || 'development';
nconf.file({ file: `config.${env}.json` });
