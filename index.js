const seneca = require('seneca');
const nconf = require('nconf');
const Consul = require('xyj-consul');

// 根据环境变量获取config文件
nconf.argv().env();
const env = process.env.NODE_ENV || 'development';
nconf.file({ file: `config.${env}.json` });
require('./mongoose');

// 注册seneca服务
const register = require('./register/register');

// 启动服务
module.exports = seneca({ log: { level: nconf.get('senecaLogLevel') } })
  .use(register)
  .listen({ type: 'http', port: nconf.get('senecaPort') })
  .ready(() => {
    // consul服务
    const consul = new Consul(nconf.get('consul'));
    consul.register(nconf.get('consul'));
  });
