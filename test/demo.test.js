const seneca = require('../index');

const expect = require('chai').expect;

const client = seneca.client({ port: 10001, host: '127.0.0.1' });
const role = 'sms';

describe('demo', () => {
  it('创建demo成功', done => {
    client.act(`role:${role}, cmd:sms_verify`, { data: { tel: '13928700821', system: 'test', usage: 'test', len: 8, code: '28354533' } }, (err, res) => {
     console.log(err,res)
    });
  });
});