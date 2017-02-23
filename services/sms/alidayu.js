const TopClient = require('./topClient').TopClient;
const Promise = require('bluebird');
const nconf = require('nconf');

const client = new TopClient(nconf.get('sms:alidayu'));
const modelConfig = {
  signUp: {
    name: '注册验证',
    template: 'SMS_33475555',
  },
  resetPWD: {
    name: '身份验证',
    template: 'SMS_33560379',
  },
  bindPhone: {
    name: '身份验证',
    template: 'SMS_33540581',
  },
};


exports.sendVerifyCode = function (tel, code, usage) {
  let name = '身份验证';
  let template = 'SMS_33555446';
  if (modelConfig[usage]) {
    name = modelConfig[usage].name;
    template = modelConfig[usage].template;
  }
  return new Promise((resolve, reject) => {
    client.execute('alibaba.aliqin.fc.sms.num.send', {
      sms_type: 'normal',
      sms_free_sign_name: name,
      sms_param: { code, product: '粑粑云' },
      rec_num: tel,
      sms_template_code: template,
    }, (err, res) => {
      if (!err) resolve(res);
      else reject(err);
    });
  });
}

