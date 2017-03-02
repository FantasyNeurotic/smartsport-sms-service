const mongoose = require('mongoose');
const _ = require('lodash');
const SmsServer = require('./sms/alidayu');
const nconf = require('nconf');

function genVerifyCode(number) {
  let length = number || 0;
  if (length < 4) length = 4;
  if (length > 20) length = 20;
  const num = ((10 ** length) - (10 ** (length - 1))) + 1;
  return parseInt((Math.random() * num) + (10 ** (length - 1)), 10);
}

function sendSmsAndSave(verifyCode) {
  return SmsServer
    .sendVerifyCode(verifyCode.tel, verifyCode.code, verifyCode.usage)
    .then(() => {
      if (verifyCode.updateAt) {
        verifyCode.updateAt = new Date();
      }
      return verifyCode.save();
    });
}

class SMSService {
  constructor(model) {
    this.Model = mongoose.model(model);
  }
  getAndSend(msg, done) {
    // 校验msg.data存在
    if (!msg.data) {
      return done(null, { success: false, msg: '缺少必须的参数msg.data' });
    }
    return this.Model
      .findOne({ tel: msg.data.tel, system: msg.data.system, usage: msg.data.usage })
      .then((code) => {
        if (!code) {
          const data = _.assign({}, msg.data, { code: genVerifyCode(msg.data.len) });
          return sendSmsAndSave(new this.Model(data))
            .then(() => done(null, { success: true, msg: '验证码请求成功' }));
        }
        if (new Date().getTime() - code.updateAt >= nconf.get('sms:expiredTime')) {
          return sendSmsAndSave(code)
            .then(() => done(null, { success: true, msg: '验证码重发成功' }));
        }
        return done(null, { success: false, msg: '请求验证码过于频繁,请稍后再试' });
      });
  }
  verify(msg, done) {
    // 校验msg.data存在
    if (!msg.data) {
      return done(null, { success: false, msg: '缺少必须的参数msg.data' });
    }
    return this.Model
      .findOne({ tel: msg.data.tel, system: msg.data.system, usage: msg.data.usage })
      .then((code) => {
        if (!code) {
          return done(null, { success: false, msg: '验证码超时或重复验证' });
        }
        if (code.code !== msg.data.code) {
          return done(null, { success: false, msg: '验证码错误' });
        }
        return this.Model
          .remove({ tel: msg.data.tel, system: msg.data.system, usage: msg.data.usage })
          .then(() => done(null, { success: true, msg: '验证成功' }));
      });
  }
}

module.exports = SMSService;
