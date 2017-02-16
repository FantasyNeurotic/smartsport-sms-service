const mongoose = require('mongoose');

class DemoService {
  constructor(model) {
    this.Model = mongoose.model(model);
  }

  /**
   * 创建
   * @param msg
   *  * data {object}
   * @param done
   * @returns {*}
   */
  create(msg, done) {
    // 校验msg.data存在
    if (!msg.data) {
      return done(null, { success: false, msg: '缺少必须的参数msg.data' });
    }
    return this.Model.findOne({ name: msg.data.name }).then((demo) => {
      if (demo) {
        return done(null, { success: false, msg: 'demo已存在' });
      }
      return new this.Model(msg.data)
        .save().then((data) => {
          done(null, { success: true, msg: '创建成功', data: data.toObject() });
        })
        .catch(done);
    });
  }
}

module.exports = DemoService;
