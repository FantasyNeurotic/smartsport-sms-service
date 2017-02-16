const seneca = require('../index');

const expect = require('chai').expect;

const client = seneca.client({ port: 10001, host: '127.0.0.1' });
const role = 'seneca-demo';

describe('demo', () => {
  it('创建demo失败：却少数据', done => {
    client.act(`role:${role}, cmd:demo_create`, (err, res) => {
      expect(err).to.be.equal(null);
      expect(res.success).to.be.equal(false);
      expect(res.msg).to.be.equal('缺少必须的参数msg.data');
      done();
    });
  });

  it('创建demo成功', done => {
    client.act(`role:${role}, cmd:demo_create`, { data: { name: '测试', number: 110 } }, (err, res) => {
      govData = res.data;
      expect(err).to.be.equal(null);
      expect(res.success).to.be.equal(true);
      expect(res.msg).to.be.equal('创建成功');
      done();
    });
  });
});