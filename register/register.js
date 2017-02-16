const nconf = require('nconf');
const config = require('../register.config.json');
const Xlog = require('xyj-logger');

Xlog.config(nconf.get('logger'));
const logger = Xlog.Logger('logs');
const serviceUrl = '../services/';
const role = nconf.get('role');

module.exports = function register() {
  // 所有服务入口log打印
  this.sub(`role:${role}, cmd:*`, (msg) => {
    const inputMsg = { role: msg.role, cmd: msg.cmd, data: msg.data };
    logger.debug(inputMsg);
  });

  // 获取所有服务
  const services = Object.keys(config);
  services.forEach((item) => {
    /* eslint-disable global-require, import/no-dynamic-require */
    const Service = require(serviceUrl + item);
    const service = new Service(...config[item].arguments);
    // 添加每个方法到seneca
    config[item].methods.forEach((method) => {
      if (method.static) {
        // 静态方法
        this.add(`role:${role}, cmd:${method.senecaCmd}`, Service[method.serviceMethod]);
      } else {
        // 原型方法
        this.add(`role:${role}, cmd:${method.senecaCmd}`, (msg, done) => {
          service[method.serviceMethod](msg, done);
        });
      }
    });
  });
};
