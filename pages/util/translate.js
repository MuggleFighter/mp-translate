const MD5 = require("./MD5.js");

const API = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const APPID = 20180817000195616;
const SECRETKEY = "i7K3wE50p3J8wIqYyXz4";

function translate({ q, from = "auto", to } = {}) {
  return new Promise((resolve, reject) => {
    const salt = 123;
    const sign = MD5(`${APPID}${q}${salt}${SECRETKEY}`);
    wx.request({
      url: API,
      data: {
        q,
        from,
        to,
        appid: APPID,
        sign,
        salt
      },
      success(res) {
        console.log(res);
        // 有数据返回且有翻译结果时
        if (res.data && res.data.trans_result){
          resolve(res.data.trans_result[0].dst)
        }else{
          reject(res)
        }
      },
      fail(err) {
        console.log(err);
        reject(err)
      }
    });
  });
}

module.exports = translate;
